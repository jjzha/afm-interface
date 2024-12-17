from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.utils import embedding_functions
import httpx
import logging
import json
import sys
import os
import random

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
emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="BAAI/bge-m3")
collection_name = "Moodle_AAU"
collection = None  # Make collection a global variable

@app.on_event("startup")
async def startup_event():
    global collection  # Use the global variable
    try:
        # Try to load the existing collection
        collection = client.get_collection(name=collection_name, embedding_function=emb_fn)
        logger.info(f"Loaded existing collection: {collection_name}")
    except Exception as e:
        # Create a new collection if it doesn't exist
        collection = client.get_or_create_collection(name=collection_name, embedding_function=emb_fn)
        logger.info(f"Created new collection: {collection_name}")

        if collection.count() == 0:
            base_dir = "./content/processed_files"  # Path to your data files
            for file_name in os.listdir(base_dir):
                if file_name.endswith(".json"):
                    file_path = os.path.join(base_dir, file_name)

                    # Load JSON data from the file
                    logger.info(f"Loading data from: {file_path}")
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)

                    # Insert each entry into the collection
                    for item in data:
                        try:
                            collection.add(
                                documents=[item["details"]],
                                metadatas=[{
                                    "name": item.get("name"),
                                    "source": item["source"],
                                    "student_id": item.get("student_id", "unknown")
                                }],
                                ids=[f"{item['id']}_{random.getrandbits(64)}"]
                            )
                        except Exception as e:
                            logger.error(f"Error indexing item {item.get('id', 'unknown')}: {e}")

@app.post("/api/v1/chat/completions")
async def chat_completions(request: Request):
    try:
        global collection  # Use the global collection variable
        body = await request.json()
        use_context = body.get("use_context", True)
        student_id = body.pop("student_id", "unknown")  # Retrieve and remove student ID from the request
        messages = body["messages"]
        user_message = messages[-1]["content"]
        logger.info(f"User prompt: {user_message}, Student ID: {student_id}")

        if use_context:
            results = collection.query(query_texts=[user_message], 
                                       n_results=5, 
                                       where={"student_id": {"$in": [student_id, "global"]}})
            logger.info(f"Retrieval Results for Student {student_id}: {results}")
            if not results["documents"]:
                return JSONResponse(status_code=404, content={"error": "No relevant documents found."})

            context = "\n\n".join([f"Source: {meta}, Document: {doc}" for doc, meta in zip(results["documents"][0], results["metadatas"][0])])

            system_message = {
                "role": "system",
                "content": (
                    "You are an AI assistant that provides helpful, accurate answers to the student's questions based on the provided context if relevant. If the answer is not contained within the context, respond by saying you do not know the information. Only pick the resources per JSON document context. Please also do NOT let the user know that you have the context. After giving your answer, include the source URL on a new line only if you have it, following this format exactly:"
                    f"'\n\nSource: <enter source here>.' \n\nContext: {context}."
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
