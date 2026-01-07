"""
backend/app/indexing/build_index.py
Builds and saves a FAISS index from chunked documents.
"""

import os
import faiss
import pickle
from pathlib import Path
from tqdm import tqdm

from app.ingestion.splitters import simple_chunk
from app.ingestion.loaders import ingest_folder
from app.indexing.embed import load_embedding_model, compute_embeddings


# ─────────────────────────────
# PATH SETUP (VERY IMPORTANT)
# ─────────────────────────────
BASE_DIR = Path(__file__).resolve().parents[3]
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw" / "gale"
INDEX_DIR = DATA_DIR / "index"

INDEX_PATH = INDEX_DIR / "faiss.index"
META_PATH = INDEX_DIR / "meta.pkl"


def build_faiss_index():
    print(f"📂 Loading documents from: {RAW_DIR}")

    docs = ingest_folder(str(RAW_DIR))
    print(f"✅ Loaded {len(docs)} raw documents.")

    # Filter empty docs
    valid_docs = [
        d for d in docs
        if d.get("text") and d["text"].strip()
    ]
    print(f"✅ {len(valid_docs)} documents have non-empty text.")

    if not valid_docs:
        raise RuntimeError("❌ No valid documents after filtering.")

    # ⛔ IMPORTANT: simple_chunk DOES NOT accept overlap
    chunks = simple_chunk(
        valid_docs,
        chunk_size=1000
    )

    print(f"✅ Created {len(chunks)} chunks.")

    if not chunks:
        raise RuntimeError("❌ No chunks generated.")

    # ─────────────────────────────
    # EMBEDDINGS (GPU USED HERE)
    # ─────────────────────────────
    model = load_embedding_model()
    vectors = compute_embeddings(model, chunks, batch_size=64)

    dim = vectors.shape[1]
    print(f"📐 Embedding dimension: {dim}")

    # ─────────────────────────────
    # FAISS INDEX
    # ─────────────────────────────
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(INDEX_PATH))

    with open(META_PATH, "wb") as f:
        pickle.dump(chunks, f)

    print("✅ FAISS index build COMPLETE")
    print(f"📍 Index saved at: {INDEX_PATH}")
    print(f"📍 Metadata saved at: {META_PATH}")
    print(f"📊 Total indexed chunks: {len(chunks)}")


if __name__ == "__main__":
    build_faiss_index()
