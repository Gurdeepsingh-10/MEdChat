# backend/app/ingestion/splitters.py
from typing import List, Dict, Any

def simple_chunk(docs: List[Dict[str, Any]], chunk_size: int = 1000) -> List[Dict[str, Any]]:
    """Naive chunking: split text every `chunk_size` characters."""
    chunks = []
    for doc in docs:
        text = doc["text"]
        for i in range(0, len(text), chunk_size):
            chunk_text = text[i:i + chunk_size]
            new_doc = {**doc, "text": chunk_text}
            chunks.append(new_doc)
    return chunks
