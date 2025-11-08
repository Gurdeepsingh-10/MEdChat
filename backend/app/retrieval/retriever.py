"""
backend/app/retrieval/retriever.py
Hybrid retriever: semantic (FAISS) + keyword (BM25/TF-IDF).
"""

import pickle
import faiss
import numpy as np
from pathlib import Path
from rank_bm25 import BM25Okapi
from sklearn.feature_extraction.text import TfidfVectorizer

INDEX_PATH = "../data/index/faiss.index"
META_PATH = "../data/index/meta.pkl"

class HybridRetriever:
    def __init__(self, top_k: int = 5):
        self.top_k = top_k
        print("🔹 Loading FAISS index and metadata ...")
        self.index = faiss.read_index(str(Path(INDEX_PATH)))
        with open(META_PATH, "rb") as f:
            self.meta = pickle.load(f)
        print(f"✅ Loaded {len(self.meta)} chunks.")

        # prepare keyword corpus for BM25/TF-IDF
        texts = [m["text"] for m in self.meta]
        self.bm25 = BM25Okapi([t.split() for t in texts])
        self.vectorizer = TfidfVectorizer(stop_words="english").fit(texts)
        self.tfidf_matrix = self.vectorizer.transform(texts)

    def semantic_search(self, query_emb: np.ndarray):
        """Search top_k in FAISS by semantic similarity."""
        scores, idx = self.index.search(query_emb, self.top_k)
        results = [self.meta[i] for i in idx[0]]
        return results

    def keyword_search(self, query: str):
        """TF-IDF + BM25 hybrid keyword search."""
        bm25_scores = self.bm25.get_scores(query.split())
        tfidf_query = self.vectorizer.transform([query])
        cosine_scores = (self.tfidf_matrix @ tfidf_query.T).toarray().ravel()
        combined = bm25_scores + cosine_scores
        top_idx = np.argsort(combined)[::-1][:self.top_k]
        return [self.meta[i] for i in top_idx]

    def hybrid_search(self, model, query: str):
        """Combine semantic + keyword retrieval."""
        q_emb = model.encode([query], normalize_embeddings=True)
        semantic_results = self.semantic_search(q_emb)
        keyword_results = self.keyword_search(query)
        combined = semantic_results + keyword_results
        seen, final = set(), []
        for doc in combined:
            src = doc["source_url"]
            if src not in seen:
                seen.add(src)
                final.append(doc)
            if len(final) >= self.top_k:
                break
        return final
