"""
backend/app/retrieval/retriever.py
Contains retrievers for the RAG pipeline:
- QdrantRetriever (for cloud vector DB)
- HybridRetriever (fallback/local testing)
"""

from qdrant_client import QdrantClient, models
from rank_bm25 import BM25Okapi
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import os

# =========================================================
# Qdrant Retriever  (Cloud Vector Database)
# =========================================================
class QdrantRetriever:
    def __init__(self, model, top_k=5, collection="gale-medical-embeddings"):
        self.model = model
        self.top_k = top_k
        self.collection = collection
        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

    def search(self, query: str):
        query_vector = self.model.encode([query], normalize_embeddings=True)[0]
        hits = self.client.search(
            collection_name=self.collection,
            query_vector=query_vector.tolist(),
            limit=self.top_k
        )
        results = [
            {
                "text": hit.payload.get("text", ""),
                "source_url": hit.payload.get("source", ""),
                "score": hit.score
            }
            for hit in hits
        ]
        return results


# =========================================================
# Hybrid Retriever (local fallback)
# =========================================================
class HybridRetriever:
    def __init__(self, docs, model, top_k=5):
        self.docs = docs
        self.model = model
        self.top_k = top_k
        self.bm25 = BM25Okapi([d["text"].split() for d in docs])
        self.vectorizer = TfidfVectorizer(stop_words="english").fit([d["text"] for d in docs])
        self.tfidf_matrix = self.vectorizer.transform([d["text"] for d in docs])

    def retrieve_bm25(self, query):
        scores = self.bm25.get_scores(query.split())
        top_idx = np.argsort(scores)[::-1][:self.top_k]
        return [self.docs[i] for i in top_idx]

    def retrieve_tfidf(self, query):
        q_vec = self.vectorizer.transform([query])
        cosine_scores = (self.tfidf_matrix @ q_vec.T).toarray().ravel()
        top_idx = np.argsort(cosine_scores)[::-1][:self.top_k]
        return [self.docs[i] for i in top_idx]
