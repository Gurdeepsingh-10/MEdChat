# backend/app/ingestion/splitters.py
from typing import List, Dict, Any

def simple_chunk(docs, chunk_size=800, overlap=150):
    chunks = []

    for doc in docs:
        text = doc["text"]
        source = doc.get("source", "")

        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "text": chunk_text,
                    "source": source
                })

            start = end - overlap  # 🔑 overlap

    return chunks
