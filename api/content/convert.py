import os
import json
import re
from docling.document_converter import DocumentConverter

def preprocess_text(text):
    """
    Cleans up text by removing excessive whitespace, decoding escaped Unicode, and trimming unnecessary characters.
    """
    # Remove excessive whitespace and normalize spacing
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Decode escaped Unicode
    text = bytes(text, "utf-8").decode("unicode_escape", errors="ignore")

    return text

def process_file(file_path, output_dir):
    """
    Converts a file into markdown and JSON using DocumentConverter and saves the parsed JSON output.
    """
    doc_converter = DocumentConverter()
    conv_result = doc_converter.convert(file_path)

    base_name = os.path.splitext(os.path.basename(file_path))[0]

    # Write markdown output (temporary)
    markdown_path = os.path.join(output_dir, f"{base_name}.md")
    with open(markdown_path, "w", encoding="utf-8") as f_md:
        f_md.write(conv_result.document.export_to_markdown())

    # Parse markdown to JSON and return the path of the parsed JSON
    return markdown_path

def parse_markdown_to_json(file_path, student_id):
    """
    Parses a markdown file and converts its contents into a JSON structure.
    Appends the student ID to each JSON object.
    """
    result = []
    current_section = None
    current_details = ""

    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    for line in lines:
        # line = preprocess_text(line)

        # Check for section headers (e.g., "## A")
        section_match = re.match(r'##\s+(\w+)', line)
        if section_match:
            # Save previous section if it exists
            if current_section and current_details:
                result.append({
                    "id": f"{current_section}_{len(result) + 1}",
                    "section": current_section,
                    "details": current_details.strip(),
                    "source": os.path.basename(file_path),
                    "student_id": student_id
                })
            # Start a new section
            current_section = section_match.group(1)
            current_details = ""  # Reset details for the new section

        elif line:  # Add any other text as part of the details
            current_details += line + " "

    # Append the last section if it exists
    if current_section and current_details:
        result.append({
            "id": f"{current_section}_{len(result) + 1}",
            "section": current_section,
            "details": current_details.strip(),
            "source": os.path.basename(file_path),
            "student_id": student_id
        })

    return result

def process_folder(input_folder, output_folder):
    """
    Recursively processes all files in a folder and its subfolders.
    Treats folder names as student IDs.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for root, _, files in os.walk(input_folder):
        student_id = os.path.basename(root)  # Use folder name as student ID

        for file in files:
            file_path = os.path.join(root, file)
            file_extension = os.path.splitext(file)[-1].lower()

            if file_extension in [".md", ".pptx", ".ppt", ".docx", ".doc", ".pdf", ".html"]:
                print(f"Processing: {file_path}")
                try:
                    markdown_path = process_file(file_path, output_folder)

                    # Parse markdown into JSON
                    parsed_json = parse_markdown_to_json(markdown_path, student_id)
                    parsed_json_path = os.path.join(output_folder, f"{os.path.splitext(file)[0]}_parsed.json")

                    with open(parsed_json_path, "w", encoding="utf-8") as f:
                        json.dump(parsed_json, f, indent=4)

                    # Remove temporary markdown file
                    os.remove(markdown_path)

                except Exception as e:
                    print(f"Error processing file {file_path}: {e}")

# Usage
input_folder = "content"
output_folder = "content/processed_files"
process_folder(input_folder, output_folder)
