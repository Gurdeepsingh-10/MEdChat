from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.settings import settings
from app.utils.logging import get_logger
from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import HybridRetriever
from app.llm.groq_client import generate_answer_groq

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

    try:
        results = retriever.hybrid_search(embedding_model, query)
        context = "\n\n".join(r["text"] for r in results[:3])

        # ---- call Groq
        try:
            answer = generate_answer_groq(context, query)
            source = "groq"
        except Exception as e:
            logger.error(f"Groq inference failed: {e}")
            return {"error": f"Groq call failed: {e}"}

        return {
            "answer": answer,
            "citations": [r["source_url"] for r in results[:3]],
            "images": [],
            "source": source,
        }

    except Exception as e:
        logger.exception("Fatal error in /chat endpoint")
        return {"error": str(e)}
