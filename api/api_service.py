from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from byaldi import RAGMultiModalModel
from pprint import pprint
import httpx
import logging
import json
import os
import sys

app = FastAPI()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("api_service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store RAG instance
RAG = None

@app.on_event("startup")
async def startup_event():
    global RAG
    logger.info("Loading pre-built index...")
    
    # Load the model and index
    rag_instance = RAGMultiModalModel.from_pretrained("vidore/colqwen2-v1.0", verbose=1)
    RAG = rag_instance.from_index("Moodle_AAU")
    
    logger.info("Pre-built index loaded successfully!")

@app.post("/api/v1/chat/completions")
async def chat_completions(request: Request):
    global RAG
    if RAG is None:
        return JSONResponse(status_code=500, content={"error": "RAG instance is not initialized."})

    try:
        body = await request.json()
        use_context = body.get("use_context", True)
        messages = body["messages"]
        user_message = messages[-1]["content"]
        new_payload_message = [{"role": "user", "content": [{"type": "text", "text": messages[-1]["content"]}]}]

        logger.info(f"User prompt: {user_message}")

        if use_context:
            results = RAG.search(user_message, k=1)
            # logger.info(pprint(results))

            if not results:
                return JSONResponse(status_code=404, content={"error": "No relevant documents found."})

            # Extract source metadata
            sources = []
            for result in results:
                source_metadata = {
                    "path": result["metadata"][0].get("path"),
                    "student": result["metadata"][0].get("student")
                }
                sources.append(source_metadata)

                new_payload_message[0]["content"].append(
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{result['base64']}"
                        }
                    }
                )
        else:
            new_payload_message[0]["content"].append(
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": ""
                        }
                    }
                )

        system_message = {
            "role": "system",
            "content": (
                "You are an AI assistant that provides helpful, accurate answers to the student's questions based on the provided context if relevant. Don't mention the new context."
            )
        }
        augmented_messages = [system_message] + new_payload_message

        llm_request = body | {"messages": augmented_messages, "stream": False}
        llm_request.pop("use_context", None)

        # Attach sources to the final response
        backend_url = "http://vllm-api:8000/v1/chat/completions"
        headers = {"Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=120) as http_client:
            resp = await http_client.post(backend_url, json=llm_request, headers=headers)
            if resp.status_code != 200:
                return JSONResponse(status_code=resp.status_code, content={"error": resp.text})

            data = resp.json()

            if use_context:
                data["sources"] = sources  # Include sources in the response
            else:
                data["sources"] = {
                    "path": "",
                    "student": ""
                }

            return JSONResponse(status_code=200, content=data)
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": "Internal server error."})