from app.ingestion import ingest_folder
docs = ingest_folder("../data/raw/gale")
print("Documents loaded:", len(docs))
print("Sample keys:", docs[0].keys())
print("Excerpt:", docs[0]["text"][:300])