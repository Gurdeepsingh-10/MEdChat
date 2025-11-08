from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .settings import settings
from .utils.logging import get_logger

logger = get_logger("backend.main")

app = FastAPI(title="Medical RAG Chatbot Backend")

# Allow local frontend (added now for later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    logger.info("Health check OK")
    return {"status": "ok", "host": settings.app_host, "port": settings.app_port}
