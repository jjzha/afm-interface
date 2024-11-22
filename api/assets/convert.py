import json
from docling.document_converter import DocumentConverter
import re

doc_converter = DocumentConverter()
conv_result = doc_converter.convert("handbook_faq.docx")

with open("faq.md", "w") as f_md:
    f_md.write(conv_result.document.export_to_markdown())

with open("processed_faq.json", "w") as f_json:
    f_json.write(json.dumps(conv_result.document.export_to_dict()))


def parse_markdown_to_json(file_path):
    result = []
    current_section = None
    current_details = ""

    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    for line in lines:
        line = line.strip()
        
        # Check for section headers (e.g., "## A")
        section_match = re.match(r'##\s+(\w+)', line)
        if section_match:
            # Save previous section if it exists
            if current_section and current_details:
                # Split details at double newlines
                split_details = [detail.strip() for detail in current_details.strip().split("\n\n")]
                for idx, detail in enumerate(split_details, start=1):
                    result.append({
                        "name": current_section,
                        "details": detail,
                        "source": f"handbook_faq_esbjerg_{current_section}.docx",
                        "id": f"handbook_faq_esbjerg_{current_section}_{idx}"
                    })
            # Start a new section
            current_section = section_match.group(1)
            current_details = ""  # Reset details for the new section

        # Check for question headers (e.g., "### Absence - how much is allowed?")
        question_match = re.match(r'###\s+(.*?)\s*$', line)
        if question_match:
            if current_details:  # Add a newline if there's existing content
                current_details += "\n\n"
            current_details += f"{question_match.group(1)}:\n"

        # Add any text under the question as part of the details
        elif line:
            current_details += line + " "

    # Append the last section if it exists
    if current_section and current_details:
        split_details = [detail.strip() for detail in current_details.strip().split("\n\n")]
        for idx, detail in enumerate(split_details, start=1):
            result.append({
                "name": current_section,
                "details": detail,
                "source": f"handbook_faq_esbjerg_{current_section}.docx",
                "id": f"handbook_faq_esbjerg_{current_section}_{idx}"
            })

    return json.dumps(result, indent=4)

# Usage
file_path = 'faq.md'
output_json = parse_markdown_to_json(file_path)
with open("faq.json", "w") as f_out:
    f_out.write(output_json)