# backend/app/indexing/embed.py

from sentence_transformers import SentenceTransformer
import torch
import numpy as np
from typing import List, Dict



MODEL_NAME = "BAAI/bge-small-en-v1.5"

def load_embedding_model():
    assert torch.cuda.is_available(), "❌ CUDA NOT AVAILABLE — PyTorch GPU install broken"

    device = "cuda"
    print(f"🚀 Loading embedding model on: {device}")

    model = SentenceTransformer(MODEL_NAME)
    model = model.to(device)

    return model

def compute_embeddings(
    model: SentenceTransformer,
    chunks: List[Dict],
    batch_size: int = 64
) -> np.ndarray:
    """
    Computes embeddings for text chunks.
    Uses GPU automatically if model is on CUDA.
    """

    texts = [c["text"] for c in chunks]

    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=True,
        normalize_embeddings=True
    )

    return embeddings.astype("float32")
