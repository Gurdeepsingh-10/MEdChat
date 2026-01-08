from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.settings import settings
from app.utils.logging import get_logger
from app.indexing.embed import load_embedding_model
from app.retrieval.retriever import FaissRetriever
from app.llm.groq_client import generate_answer_groq
from time import perf_counter
from app.utils.log_manager import log_interaction
from app.evaluation.evaluator import evaluate_retrieval, evaluate_answer_faithfulness
import numpy as np
from app.memory.memory import ConversationMemory
from app.llm.query_rewriter import rewrite_query


memory = ConversationMemory(max_turns=4)


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
retriever = FaissRetriever(
    model=embedding_model,
    top_k=3
)


class ChatRequest(BaseModel):
    query: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/chat")
async def chat(request: ChatRequest):
    user_query = request.query
    memory.add_user(user_query)

    # 1️⃣ Rewrite query using memory
    memory_context = memory.get_context()
    rewritten_query = rewrite_query(memory_context, user_query)

    # 2️⃣ Retrieve using rewritten query
    results = retriever.search(rewritten_query)
    context = "\n\n".join(r["text"] for r in results[:3])

    # 3️⃣ Generate answer
    answer = generate_answer_groq(context, rewritten_query)

    memory.add_assistant(answer)

    return {
        "answer": answer,
        "citations": [r["source_url"] for r in results[:3]],
        "rewritten_query": rewritten_query,
    }

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
