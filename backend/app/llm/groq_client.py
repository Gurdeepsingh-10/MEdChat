"""
backend/app/llm/groq_client.py
Handles Groq-hosted Llama-3 inference with medical grounding.
"""

import os
from groq import Groq


# --------------------------------------------------
# Groq Client Loader
# --------------------------------------------------
def get_groq_client():
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError("Missing GROQ_API_KEY in environment")
    return Groq(api_key=key)


# --------------------------------------------------
# Medical Answer Generator (Option C)
# --------------------------------------------------
def generate_answer_groq(context: str, query: str):
    client = get_groq_client()

    SYSTEM_PROMPT = """
You are a medical information assistant.

STRICT RULES:
- Use ONLY the provided context.
- If the answer is not present in the context, clearly say so.
- Do NOT diagnose or prescribe.
- Do NOT speculate or hallucinate.
- Use neutral, encyclopedic language.

ANSWER FORMAT:
- Definition
- Causes
- Symptoms
- Diagnosis
- Treatment
- Prevention (if applicable)

"
"""

    USER_PROMPT = f"""
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
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": USER_PROMPT},
            ],
            temperature=0.25,
            max_tokens=700,
        )

        answer = response.choices[0].message.content.strip()

        # --------------------------------------------------
        # Confidence Calibration (Low-context safeguard)
        # --------------------------------------------------
        if len(context.strip()) < 300:
            answer = (
                "The available medical sources do not provide sufficient "
                "information to answer this question reliably.\n\n"
                + answer
            )

        return answer

    except Exception as e:
        print("❌ Groq error:", e)
        raise
