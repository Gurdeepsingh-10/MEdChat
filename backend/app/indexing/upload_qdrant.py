from qdrant_client import QdrantClient, models
import faiss, pickle, numpy as np
import os
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))



QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
INDEX_PATH = "../data/index/faiss.index"
META_PATH = "../data/index/meta.pkl"
print("QDRANT_URL =", QDRANT_URL)
print("QDRANT_API_KEY =", QDRANT_API_KEY[:6] + "..." if QDRANT_API_KEY else None)

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

print("🔹 Connecting to Qdrant Cloud...")
client.get_collections()

collection_name = "gale-medical-embeddings"

# Load FAISS + metadata
index = faiss.read_index(INDEX_PATH)
with open(META_PATH, "rb") as f:
    chunks = pickle.load(f)

vectors = index.reconstruct_n(0, index.ntotal)
print(f"✅ Loaded {len(vectors)} vectors for upload")

# Create collection (if not exists)
client.recreate_collection(
    collection_name=collection_name,
    vectors_config=models.VectorParams(size=vectors.shape[1], distance=models.Distance.COSINE),
)

# Prepare points
points = [
    models.PointStruct(
        id=i,
        vector=vectors[i].tolist(),
        payload={"text": chunks[i]["text"], "source": chunks[i]["source_url"]}
    )
    for i in range(len(vectors))
]

# Upload in batches
BATCH = 500
for i in range(0, len(points), BATCH):
    client.upsert(collection_name=collection_name, points=points[i:i+BATCH])
    print(f"Uploaded {i+BATCH}/{len(points)}")

print("✅ All vectors uploaded to Qdrant Cloud.")
