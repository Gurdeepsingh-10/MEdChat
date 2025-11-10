from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.settings import settings
from app.utils.logging import get_logger
from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import QdrantRetriever
from app.llm.groq_client import generate_answer_groq
from time import perf_counter
from app.utils.log_manager import log_interaction
from app.evaluation.evaluator import evaluate_retrieval, evaluate_answer_faithfulness
import numpy as np

logger = get_logger("backend.main")
app = FastAPI(title="Medical RAG Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local frontend testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and retriever
embedding_model = load_embedding_model()
retriever = QdrantRetriever(model=embedding_model, top_k=3)

class ChatRequest(BaseModel):
    query: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/chat")
async def chat(request: ChatRequest):
    query = request.query
    logger.info(f"User query: {query}")
    start = perf_counter()

    try:
        results = retriever.search(query)
        context = "\n\n".join(r["text"] for r in results[:3])
        answer = generate_answer_groq(context, query)
        source = "groq"

        latency = (perf_counter() - start) * 1000
        log_interaction(
            query=query,
            context_snippets=results,
            answer=answer,
            model_name="llama-3.1-8b-instant",
            source=source,
            latency_ms=latency,
        )
        return {
            "answer": answer,
            "citations": [r["source_url"] for r in results[:3]],
            "latency_ms": round(latency, 2),
            "source": source,
        }

    except Exception as e:
        logger.exception("Error in /chat")
        return {"error": str(e)}

@app.post("/evaluate")
async def evaluate(request: ChatRequest):
    query = request.query
    results = retriever.search(query)
    context = "\n\n".join(r["text"] for r in results[:3])
    q_emb = embedding_model.encode([query], normalize_embeddings=True)
    doc_embs = np.array([embedding_model.encode([r["text"]], normalize_embeddings=True)[0] for r in results])
    retrieval_score = evaluate_retrieval(q_emb, doc_embs)
    answer = generate_answer_groq(context, query)
    faith_score = evaluate_answer_faithfulness(answer, context)

    return {
        "query": query,
        "retrieval_similarity": retrieval_score,
        "faithfulness": faith_score,
        "answer": answer,
    }
