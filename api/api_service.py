from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.utils import embedding_functions
import httpx
import logging
import json
import sys

app = FastAPI()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
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

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./.chroma")
emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="paraphrase-multilingual-mpnet-base-v2")
collection = client.get_or_create_collection(name="Moodle_AAU", embedding_function=emb_fn)

# Load course data on startup
@app.on_event("startup")
async def startup_event():
    if collection.count() == 0:
        with open("./assets/courses.json", "r") as f:
            courses = json.load(f)

        for course in courses:
            collection.add(
                documents=[course["details"]],
                metadatas=[{"course_name": course["course_name"], "source": course["source"]}],
                ids=[course["id"]]
            )
        logger.info("Courses loaded into ChromaDB")

@app.post("/api/v1/chat/completions")
async def chat_completions(request: Request):
    try:
        body = await request.json()
        use_context = body.get("use_context", True)
        messages = body["messages"]
        user_message = messages[-1]["content"]
        logger.info(f"User prompt: {user_message}")

        if use_context:
            results = collection.query(query_texts=[user_message], n_results=1)
            if not results["documents"]:
                return JSONResponse(status_code=404, content={"error": "No relevant documents found."})

            context = "\n\n".join(results["documents"][0])[:4096]  # Trim context if needed
            metadata = json.dumps(results["metadatas"][0])

            system_message = {
                "role": "system",
                "content": (
                    "You are an AI assistant that provides helpful, accurate answers to the user's questions based on the provided context in either English or Danish. If the answer is not contained within the context, respond by saying you do not know the information. Please also do NOT let the user know that you have the context. After giving your answer, always include the source URL on a new line, following this format exactly:"
                    f"'\n\nSource: <enter source here>.' \n\nContext: {context}\n\nMetadata: {metadata}."
                )
            }
            augmented_messages = [system_message] + messages
        else:
            augmented_messages = messages

        llm_request = body | {"messages": augmented_messages, "stream": False}
        llm_request.pop("use_context", None)

        backend_url = "http://vllm-api:8000/v1/chat/completions"
        headers = {"Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(backend_url, json=llm_request, headers=headers)
            if resp.status_code != 200:
                return JSONResponse(status_code=resp.status_code, content={"error": resp.text})

            return JSONResponse(status_code=200, content=resp.json())
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": "Internal server error."})
