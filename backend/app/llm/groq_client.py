"""
backend/app/llm/groq_client.py
Handles Groq-hosted Llama-3 inference.
"""

import os
from urllib import response
from groq import Groq

def get_groq_client():
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError("Missing GROQ_API_KEY in .env")
    return Groq(api_key=key)

def generate_answer_groq(context: str, query: str):
    client = get_groq_client()
    prompt = f"""
You are a medical knowledge assistant trained on reliable encyclopedia data.
Answer the user's query using ONLY the provided context.
If the answer isn't in the context, say 'Not found in my sources.'
Cite information with [1], [2], etc.

Context:
{context}

Question:
{query}

Answer:
"""
    try:
        response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
        {"role": "system", "content": "You are a helpful medical assistant."},
        {"role": "user", "content": prompt}
    ],
        temperature=0.3,
        max_tokens=512,
)

        return response.choices[0].message.content.strip()
    except Exception as e:
        print("❌ Groq error:", e)
        raise
