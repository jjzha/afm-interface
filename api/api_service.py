from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.utils import embedding_functions
import httpx
import logging
import json
import logging
import sys

app = FastAPI()

# Set up logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level to INFO
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)  # Ensure logs are sent to stdout
    ]
)
logger = logging.getLogger("api_service")

# Enable CORS (adjust 'allow_origins' to your frontend URL if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api_service")

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./.chroma")
emb_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
collection = client.get_or_create_collection(name="Moodle_AAU", embedding_function=emb_ef)

@app.on_event("startup")
async def startup_event():
    if collection.count() == 0:
        # Add your documents to ChromaDB
        machine_intelligence = """
        Module: Specialization in Machine Intelligence / Specialiseringskursus i maskinintelligens (spMI), 5 ECTS
        Coordinators: Manfred Jaeger, Kim Guldstrand Larsen, Martin Kristjansen, Tomer Sagi, Thomas Dyhre Nielsen, Christian S. Jensen, Anders Læsø Madsen, Daniele Dell'Aglio, Alvaro Torralba
        Language: English
        Objectives: As described in study regulations
        Scope: 150 hours
        Participants: DAT9, AAL-SW9, CS-IT9
        Activities: Seminar-style sessions with student presentations and discussions
        Examination: Oral exam; 7-day article prep; 30-minute presentation + 10-minute discussion
        """

        web_intelligence = """
        Module: Web Intelligence (WI), 5 ECTS
        Coordinator: Manfred Jaeger (jaeger@cs.aau.dk)
        Language: English
        Objectives: 
        The amount of digital information on the web is growing at an explosive pace. People, organizations, and corporations continuously add various types of information to the web, connect to each other, collaborate on tasks, and log user interactions. Web Intelligence applies machine intelligence to the web, combining theories and techniques from information retrieval, network science, and machine learning.
        Core topics:
        - Information retrieval, search, and ranking
        - Social network analytics
        - Information diffusion on networks
        - Neural network approaches for prediction on networks
        - Recommender systems
        Scope: 150 hours (30 hours per ECTS credit)
        Structure: 11 two-hour lectures and two-hour exercise sessions, complemented by weekly 4-hour self-study assignments.
        Participants: SW7
        Activities: Lectures, exercises, and self-studies
        Examination: Oral examination based on course material and self-studies
        """

        imperative_programming = """
        Module: Imperative Programmering / Imperativ programmering (IMPR), 5 ECTS  
        Coordinator: Anders Schlichtkrull (andsch@cs.aau.dk)  
        Type and Language: Course and readings in Danish  
        Objectives: The course aims to give students insight into fundamental concepts such as algorithms, data structures, and computer architecture.
        Knowledge: - Development environment and compilation - Imperative principles - Data types and variables - Control structures - Functions and procedures - Data structures including arrays - Input / Output - Composite data structures - Simple algorithms (e.g., sorting and searching) - Basic program testing 
        Skills: - Writing, running, and testing programs that incorporate basic concepts - Applying accurate subject terminology
        Competences: - Implementing an imperative program independently or collaboratively as a solution to a defined task
        Academic Content and Conjunction with Other Modules/Semesters: The course is closely related to the P1 project and shares several connections with the DTG course.
        Scope and Expected Performance: AAU expects each student to spend 30 hours per ECTS, totaling 150 hours.
        Participants: CPH-SW1, CCT1  
        Prerequisites for Participation: As a 1st-semester course, no special prerequisites are required.
        Module Activities: The course includes 14 lessons, each involving live coding demonstrations and preparatory materials (videos, textbook chapters). Weekly lessons involve interactive discussions, group assignments, and feedback on individual tasks. - 14 auditorium lessons: approx. 28 hours - 13 group assignments: approx. 25 hours - Individual preparation: approx. 64 hours - Video lessons: approx. 14 hours - Book reading and further work: approx. 20 hours - Assignments: approx. 30 hours - Exam preparation: 7-10 hours
        Examination: Written or oral exam; final exam format and allowed aids to be announced on the course page.
        """

        collection.add(
            documents=[machine_intelligence, web_intelligence, imperative_programming],
            metadatas=[{"course_name": "Machine Intelligence",
                        "source": "https://www.moodle.aau.dk/mod/page/view.php?id=1755016"}, 
                       {"course_name": "Web Intelligence",
                        "source": "https://www.moodle.aau.dk/mod/page/view.php?id=1412554"},
                       {"course_name": "Imperative Programming",
                        "source": "https://www.moodle.aau.dk/mod/page/view.php?id=1754716"}],
            ids=["id1", "id2", "id3"]
        )

@app.post("/api/v1/chat/completions")
async def chat_completions(request: Request):
    try:
        logger.info("Received request")
        body = await request.json()
        logger.info("Parsed request body")

        use_context = body.get("use_context", True)  # Default to True if not provided
        messages = body['messages']
        user_message = messages[-1]['content']
        logger.info(f"User prompt: {user_message}")

        if use_context:
            # Retrieve relevant documents from ChromaDB
            results = collection.query(
                query_texts=[user_message],
                n_results=1
            )
            logger.info("Queried ChromaDB")

            if not results['documents']:
                logger.info("No relevant documents found for the query.")
                return JSONResponse(status_code=404, content={"error": "No relevant documents found."})

            retrieved_docs = [doc for doc in results['documents'][0]]
            retrieved_metadata = [doc for doc in results['metadatas'][0]]
            context = "\n\n".join(retrieved_docs)
            metadata = json.dumps(retrieved_metadata)

            # Limit context length if necessary
            max_context_length = 4096  # Adjust as needed
            context = context[:max_context_length]

            system_message = {
                "role": "system",
                "content": (
                    "You are an AI assistant that provides helpful, accurate answers to the user's questions based on the provided context. If the answer is not contained within the context, respond by saying you do not know the information. Please also do NOT let the user know that you have the context. After giving your answer, always include the source on a new line, following this format exactly:"
                    f"'\n\nSource: <enter source here>.' \n\nContext: {context}\n\nMetadata: {metadata}."
                )
            }

            augmented_messages = [system_message] + messages
        else:
            # If context is not used, just forward the user's messages
            augmented_messages = messages

        llm_request = body.copy()
        llm_request['messages'] = augmented_messages
        llm_request['stream'] = False
        del llm_request['use_context']

        backend_url = "http://backend:8000/v1/chat/completions"
        headers = {"Content-Type": "application/json"}

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(backend_url, json=llm_request, headers=headers)
            if resp.status_code != 200:
                return JSONResponse(status_code=resp.status_code, content={"error": resp.text})

            return JSONResponse(status_code=200, content=resp.json())
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": "Internal server error."})
