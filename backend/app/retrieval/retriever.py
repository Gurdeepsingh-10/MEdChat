# backend/app/retrieval/retriever.py

from pathlib import Path
import faiss
import pickle
import numpy as np

print("🔥 retriever.py LOADED")

# -------------------------------------------------
# Resolve PROJECT ROOT correctly
# retriever.py -> retrieval -> app -> backend -> ROOT
# -------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[3]

DATA_DIR = BASE_DIR / "data" / "index"
INDEX_PATH = DATA_DIR / "faiss.index"
META_PATH = DATA_DIR / "meta.pkl"


class FaissRetriever:
    def __init__(self, model, top_k=5):
        print("🔥 Initializing FAISS Retriever")
        print(f"📍 FAISS index path: {INDEX_PATH}")
        print(f"📍 Metadata path: {META_PATH}")

        if not INDEX_PATH.exists():
            raise RuntimeError(f"FAISS index not found at {INDEX_PATH}")

        if not META_PATH.exists():
            raise RuntimeError(f"Metadata not found at {META_PATH}")

        self.model = model
        self.top_k = top_k

        # Load FAISS index
        self.index = faiss.read_index(str(INDEX_PATH))

        # Load metadata
        with open(META_PATH, "rb") as f:
            self.docs = pickle.load(f)

        print(f"✅ FAISS index loaded successfully ({len(self.docs)} documents)")

    def search(self, query: str):
        # Encode query
        query_vec = self.model.encode(
            [query],
            normalize_embeddings=True
        ).astype("float32")

        # FAISS search
        scores, indices = self.index.search(query_vec, self.top_k)

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue

            doc = self.docs[idx]
            results.append({
                "text": doc["text"],
                "source_url": doc.get("source", ""),
                "score": float(score)
            })

        return results
