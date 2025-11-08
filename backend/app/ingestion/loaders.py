"""
backend/app/ingestion/loaders.py
--------------------------------
Handles loading and basic extraction of text and metadata
from PDFs and HTML files for ingestion.
"""

import os
from pathlib import Path
from typing import List, Dict, Any
from bs4 import BeautifulSoup
from langchain_community.document_loaders import PyPDFLoader

# -------------------------------
# Utility Functions
# -------------------------------

def load_pdf(path: str) -> List[Dict[str, Any]]:
    """Extract pages from a PDF as a list of dicts."""
    docs = []
    loader = PyPDFLoader(path)
    for doc in loader.load():
        docs.append({
            "text": doc.page_content,
            "source_url": str(Path(path).absolute()),
            "title": Path(path).stem,
            "section": None,
            "license": "Authorized use — The Gale Encyclopedia of Medicine",
            "attribution": "yeah its licensed ",
            "images": []
        })
    return docs


def load_html(path: str) -> List[Dict[str, Any]]:
    """Extract text from an HTML file as a list of dicts."""
    docs = []
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    soup = BeautifulSoup(html, "html.parser")

    # Extract title and text
    title = soup.title.string if soup.title else Path(path).stem
    text = " ".join(p.get_text() for p in soup.find_all("p"))
    docs.append({
        "text": text,
        "source_url": str(Path(path).absolute()),
        "title": title,
        "section": None,
        "license": "Authorized use — The Gale Encyclopedia of Medicine",
        "attribution": "Used with permission of the author",
        "images": []
    })
    return docs


def ingest_folder(folder_path: str = "../data/raw/gale") -> List[Dict[str, Any]]:
    """Iterate through all files in a folder and load supported types."""
    all_docs = []
    folder = Path(folder_path)
    if not folder.exists():
        raise FileNotFoundError(f"Folder not found: {folder_path}")

    for file in folder.glob("**/*"):
        if file.suffix.lower() == ".pdf":
            all_docs.extend(load_pdf(str(file)))
        elif file.suffix.lower() in [".html", ".htm"]:
            all_docs.extend(load_html(str(file)))

    print(f"✅ Loaded {len(all_docs)} documents from {folder_path}")
    return all_docs
