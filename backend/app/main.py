from fastapi import FastAPI

app = FastAPI(title="Medical RAG Chatbot Backend")

@app.get("/health")
async def health():
    return {"status": "ok"}
