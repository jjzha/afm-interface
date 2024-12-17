import os
import chromadb
from chromadb.utils import embedding_functions
import json
import logging
import random

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("indexer")

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./.chroma")
emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="BAAI/bge-m3")
collection = client.get_or_create_collection(name="Moodle_AAU", embedding_function=emb_fn)

# Load course data on startup
def index_files(base_dir):
    """
    Indexes all JSON files in the base directory into ChromaDB.
    Each JSON file should contain structured data with "details", "name", "source", and "student_id".
    """
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
                    if len(item["details"].split()) > 3:
                        collection.add(
                            documents=[item["details"]],
                            metadatas=[{
                                "name": item.get("section"),
                                "source": item["source"],
                                "student_id": item.get("student_id", "unknown")
                            }],
                            ids=[f"{item['id']}_{random.getrandbits(64)}"]
                        )
                except Exception as e:
                    logger.error(f"Error indexing item {item.get('id', 'unknown')}: {e}")

if __name__ == "__main__":
    base_dir = "./content/processed_files"  # Path to your data files
    logger.info("Starting indexing process...")
    index_files(base_dir)
    logger.info("Indexing completed!")
