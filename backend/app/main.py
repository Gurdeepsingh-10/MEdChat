from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.settings import settings
from app.utils.logging import get_logger
from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import HybridRetriever
from app.llm.groq_client import generate_answer_groq
from time import perf_counter
from app.utils.log_manager import log_interaction

logger = get_logger("backend.main")
app = FastAPI(title="Medical RAG Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_model = load_embedding_model()
retriever = HybridRetriever(top_k=3)

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