"""
backend/app/indexing/embed.py
Encodes text chunks into embeddings using sentence-transformers.
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from tqdm import tqdm

def load_embedding_model(model_name: str = "BAAI/bge-small-en-v1.5"):
    print(f"🔹 Loading embedding model: {model_name}")
    model = SentenceTransformer(model_name)
    return model

def compute_embeddings(model, chunks):
    """Return numpy array of embeddings + metadata list."""
    texts = [c["text"] for c in chunks]
    print(f"🔹 Encoding {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True, normalize_embeddings=True)
    return np.array(embeddings)
