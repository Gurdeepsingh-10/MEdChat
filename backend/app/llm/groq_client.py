"""
backend/app/llm/groq_client.py
Handles Groq-hosted Llama-3 inference.
"""

import os
from groq import Groq

def get_groq_client():
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError("Missing GROQ_API_KEY in .env")
    return Groq(api_key=key)

def generate_answer_groq(context: str, query: str):
    client = get_groq_client()
    prompt = f"""
You are a medical knowledge assistant trained on the Gale Encyclopedia of Medicine.
Answer the user's query using only the provided context.
If unsure, say "Not found in my sources."
Cite the information using [1], [2] etc.

Context:
{context}

User question:
{query}

Answer:
"""
    response = client.chat.completions.create(
        model="mixtral-8x7b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=512,
    )
    return response.choices[0].message.content.strip()
