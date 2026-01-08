from app.llm.groq_client import get_groq_client


def rewrite_query(memory_context: str, query: str) -> str:
    """
    Rewrite a follow-up question into a standalone medical query
    using recent conversation memory.
    """

    # If no memory yet, just return the original query
    if not memory_context.strip():
        return query

    client = get_groq_client()

    prompt = f"""
You are a medical query rewriter.

Given the conversation history and the new user question,
rewrite the question into a fully self-contained medical query.

Conversation History:
{memory_context}

User Question:
{query}

Standalone Medical Question:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You rewrite medical queries."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=120,
    )

    return response.choices[0].message.content.strip()
