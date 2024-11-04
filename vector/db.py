import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions

from sentence_transformers import SentenceTransformer

import pprint
import os

def main():
    client = chromadb.PersistentClient(path="./.chroma")
    emb_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")   
    collection = client.get_or_create_collection(name="Moodle_AAU", embedding_function=emb_ef)

    student_info = """
    Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
    is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
    in her free time in hopes of working at a tech company after graduating from the University of Washington.
    """

    club_info = """
    The university chess club provides an outlet for students to come together and enjoy playing
    the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
    the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
    participate in tournaments, analyze famous chess matches, and improve members' skills.
    """

    university_info = """
    The University of Washington, founded in 1861 in Seattle, is a public research university
    with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
    As the flagship institution of the six public universities in Washington state,
    UW encompasses over 500 buildings and 20 million square feet of space,
    including one of the largest library systems in the world.
    """

    if collection.count() == 0:
        collection.add(
            documents = [student_info, club_info, university_info],
            metadatas = [{"source": "student info"},{"source": "club info"},{'source':'university info'}],
            ids = ["id1", "id2", "id3"]
        )

    results = collection.query(
        query_texts=["Where can I find the nearest chess club?"],
        n_results=2
    )

    pprint.pprint(results)

if __name__ == '__main__':
    main()