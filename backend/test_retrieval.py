from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import HybridRetriever

model = load_embedding_model()
retriever = HybridRetriever(top_k=3)

query = "What are the symptoms of diabetes?"
results = retriever.hybrid_search(model, query)

print("\n=== Top Matches ===")
for i, r in enumerate(results, 1):
    print(f"\n[{i}] {r['title']}")
    print(r['text'][:300], "...")
