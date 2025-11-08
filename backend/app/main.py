from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.settings import settings
from app.utils.logging import get_logger
from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import HybridRetriever
from app.llm.groq_client import generate_answer_groq
from app.llm.local_fallback import load_local_model, generate_answer_local
import os

logger = get_logger("backend.main")
app = FastAPI(title="Medical RAG Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load retriever and model once
embedding_model = load_embedding_model()
retriever = HybridRetriever(top_k=3)

# optional local fallback
local_tokenizer, local_model = None, None

class ChatRequest(BaseModel):
    query: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/chat")
async def chat(request: ChatRequest):
    query = request.query
    logger.info(f"User query: {query}")

    results = retriever.hybrid_search(embedding_model, query)
    context = "\n\n".join(r["text"] for r in results[:3])

    try:
        answer = generate_answer_groq(context, query)
        source = "groq"
    except Exception as e:
        logger.warning(f"Groq failed: {e}")
        global local_model, local_tokenizer
        if not local_model:
            local_tokenizer, local_model = load_local_model()
        answer = generate_answer_local(local_tokenizer, local_model, context, query)
        source = "local"

    return {
        "answer": answer,
        "citations": [r["source_url"] for r in results[:3]],
        "images": [],
        "source": source,
    }
