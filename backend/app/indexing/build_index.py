"""
backend/app/indexing/build_faiss_index.py
Builds and saves a FAISS index from chunked documents.
"""

from pathlib import Path
import faiss
import numpy as np
import pickle
from tqdm import tqdm

from app.ingestion.splitters import simple_chunk
from app.ingestion.loaders import ingest_folder
from app.indexing.embed import load_embedding_model, compute_embeddings

# =====================================================
# Robust absolute paths (NO relative path bugs)
# =====================================================
BASE_DIR = Path(__file__).resolve().parents[3]   # project root
DATA_DIR = BASE_DIR / "data"
INDEX_DIR = DATA_DIR / "index"
RAW_DIR = DATA_DIR / "raw" / "gale"

INDEX_DIR.mkdir(parents=True, exist_ok=True)

INDEX_PATH = INDEX_DIR / "faiss.index"
META_PATH = INDEX_DIR / "meta.pkl"

# =====================================================
# Build FAISS Index
# =====================================================
def build_faiss_index(data_folder: Path = RAW_DIR):
    print(f"📂 Loading documents from: {data_folder}")

    docs = ingest_folder(str(data_folder))
    print(f"✅ Loaded {len(docs)} raw documents.")

    # -------------------------------------------------
    # Filter empty docs
    # -------------------------------------------------
    valid_docs = [d for d in docs if d.get("text") and d["text"].strip()]
    print(f"✅ {len(valid_docs)} documents have non-empty text.")

    if not valid_docs:
        raise RuntimeError("❌ No valid documents found after extraction.")

    # -------------------------------------------------
    # Chunking (IMPROVED)
    # -------------------------------------------------
    chunks = simple_chunk(
        valid_docs,
        chunk_size=700,
        overlap=150
    )
    print(f"✅ Created {len(chunks)} chunks.")

    if not chunks:
        raise RuntimeError("❌ Chunking produced zero chunks.")

    # -------------------------------------------------
    # Embeddings
    # -------------------------------------------------
    print("🧠 Loading embedding model...")
    model = load_embedding_model()

    print("🧠 Computing embeddings...")
    vectors = compute_embeddings(model, chunks)

    if vectors is None or len(vectors) == 0:
        raise RuntimeError("❌ No embeddings computed.")

    # Ensure float32 + normalized
    vectors = np.asarray(vectors, dtype="float32")
    faiss.normalize_L2(vectors)

    # -------------------------------------------------
    # FAISS index
    # -------------------------------------------------
    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    faiss.write_index(index, str(INDEX_PATH))

    with open(META_PATH, "wb") as f:
        pickle.dump(chunks, f)

    print("🎉 FAISS index built successfully!")
    print(f"📦 Chunks indexed: {len(chunks)}")
    print(f"📐 Vector dimension: {dim}")
    print(f"📍 Index saved at: {INDEX_PATH}")
    print(f"📍 Metadata saved at: {META_PATH}")


# =====================================================
# Entry point
# =====================================================
if __name__ == "__main__":
    build_faiss_index()
