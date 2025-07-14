import fitz

def retrieve_text(contents: bytes) -> None:
    """Extracts text from a PDF file using PyMuPDF.

    Args:
        file_path (str): The path to the PDF file.
    Returns:
        str: The extracted text from the PDF.
    """
    doc = fitz.open(stream=contents, filetype="pdf")
    doc_text = []
    for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            doc_text.append(text)
    
    return doc_text