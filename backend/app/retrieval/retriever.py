# backend/app/retrieval/retriever.py

from pathlib import Path
import faiss
import pickle
import numpy as np


BASE_DIR = Path(__file__).resolve().parents[3]
INDEX_DIR = BASE_DIR / "data" / "index"

INDEX_PATH = INDEX_DIR / "faiss.index"
META_PATH = INDEX_DIR / "meta.pkl"


class FaissRetriever:
    def __init__(self, model, top_k=5):
        print("🔥 Initializing FAISS Retriever")
        print(f"📍 FAISS index path: {INDEX_PATH}")
        print(f"📍 Metadata path: {META_PATH}")

        self.model = model
        self.top_k = top_k

        # FAISS handles file errors internally
        self.index = faiss.read_index(str(INDEX_PATH))

        with open(META_PATH, "rb") as f:
            self.docs = pickle.load(f)

        print(f"✅ FAISS index loaded successfully ({len(self.docs)} documents)")

    def search(self, query: str):
        query_vec = self.model.encode(
            [query],
            normalize_embeddings=True
        ).astype("float32")

        scores, indices = self.index.search(query_vec, self.top_k)

        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue
            if score < 0.25:   # 🔑 similarity cutoff
                continue

            doc = self.docs[idx]
            results.append({
                "text": doc["text"],
                "source_url": doc.get("source", ""),
                "score": float(score)
            })

        return results
