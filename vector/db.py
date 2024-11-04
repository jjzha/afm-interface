# pip install chromadb ragatouille==0.2.19 Ninja
# pip uninstall --y faiss-cpu & pip install https://github.com/kyamagu/faiss-wheels/releases/download/v1.7.3/faiss_gpu-1.7.3-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whlpip3

# echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
# echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
# source ~/.bashrc

import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions

from ragatouille import RAGPretrainedModel


def main():
    RAG = RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0", n_gpu=1)
    # client = chromadb.Client(Settings(chroma_db_impl="duckdb+parquet",
                                        # persist_directory="db/"
                                    # ))

    # collection = client.create_collection(name="Moodle_AAU")


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

    RAG.index(
    # List of Documents
    collection=[student_info, club_info, university_info],
    # List of IDs for the above Documents
    document_ids=["student", "club", "university"],
    document_metadatas=[{}, {}, {}],
    # Name of the index
    index_name="Moodle_AAU",
    # Chunk Size of the Document Chunks
    max_document_length=256,
    # Wether to Split Document or Not
    split_documents=True,
    use_faiss=True
    )

    # collection.add(
    #     documents = [student_info, club_info, university_info],
    #     metadatas = [{"source": "student info"},{"source": "club info"},{'source':'university info'}],
    #     ids = ["id1", "id2", "id3"]
    # )

    # results = collection.query(
    #     query_texts=["What is the student name?"],
    #     n_results=2
    # )

    # print(results)

    results = RAG.search(query="How big is the University of Washington?", k=3, index_name='Moodle_AAU')
    for i, doc, in enumerate(results):
        print(f"---------------------------------- doc-{i} ------------------------------------")
        print(doc["content"])


if __name__ == '__main__':
    main()