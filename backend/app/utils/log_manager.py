import json, os, time
from datetime import datetime

LOG_DIR = "../data/logs"
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, f"rag_session_{datetime.now().strftime('%Y%m%d')}.jsonl")

def log_interaction(query, context_snippets, answer, model_name, source, latency_ms):
    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "query": query,
        "retrieved_docs": [
            {"text": c.get("text", "")[:300], "source": c.get("source_url", ""), "score": c.get("score", None)}
            for c in context_snippets
        ],
        "answer": answer,
        "model": model_name,
        "source": source,
        "latency_ms": latency_ms,
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
