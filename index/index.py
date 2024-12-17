from byaldi import RAGMultiModalModel
import os

# Initialize the RAG model
rag_instance = RAGMultiModalModel.from_pretrained("vidore/colqwen2-v1.0", verbose=1)

# Index files
base_dir = "./api/content"  # Path to your data files
rag_instance.index(
    input_path=f"{base_dir}/global/Data til AAU Concierge.pdf",
    index_name="Moodle_AAU",
    store_collection_with_index=True,
    metadata=[{"path": f"{base_dir}/global/data_aau_concierge.pdf", "student": "global"}],
    overwrite=True
)

# Add additional files to the index
for subfolder in os.listdir(base_dir):
    subfolder_path = os.path.join(base_dir, subfolder)
    if os.path.isdir(subfolder_path):
        for file in os.listdir(subfolder_path):
            file_path = os.path.join(subfolder_path, file)
            if os.path.isfile(file_path):
                rag_instance.add_to_index(
                    file_path,
                    store_collection_with_index=True,
                    metadata=[{"path": file_path, "student": subfolder}],
                )

print(f"Finished!")
