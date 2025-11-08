"""
backend/app/indexing/build_index.py
Builds and saves a FAISS index from chunked documents.
"""

import os
import faiss
import numpy as np
import pickle
from tqdm import tqdm
from app.ingestion.splitters import simple_chunk
from app.ingestion.loaders import ingest_folder
from app.indexing.embed import load_embedding_model, compute_embeddings

INDEX_PATH = "../data/index/faiss.index"
META_PATH = "../data/index/meta.pkl"

def build_faiss_index(data_folder: str = "../data/raw/gale"):
    docs = ingest_folder(data_folder)
    chunks = simple_chunk(docs, chunk_size=1000)

    model = load_embedding_model()
    vectors = compute_embeddings(model, chunks)

    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)   # cosine similarity (since normalized)
    index.add(vectors)
    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)
    faiss.write_index(index, INDEX_PATH)

    # store metadata (for retrieval display)
    with open(META_PATH, "wb") as f:
        pickle.dump(chunks, f)

    print(f"✅ FAISS index built and saved to {INDEX_PATH}")
    print(f"✅ Metadata saved to {META_PATH}")
    print(f"Indexed {len(chunks)} chunks with dimension {dim}")

if __name__ == "__main__":
    build_faiss_index()
