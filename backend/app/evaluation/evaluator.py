from sentence_transformers import util
import numpy as np

def evaluate_retrieval(query_embedding, retrieved_embeddings):
    """Cosine similarity of query vs retrieved docs."""
    scores = util.cos_sim(query_embedding, retrieved_embeddings)
    avg_score = np.mean(scores.numpy())
    return round(float(avg_score), 4)

def evaluate_answer_faithfulness(answer: str, context: str):
    """Crude heuristic: % of answer words present in context."""
    answer_words = set(answer.lower().split())
    context_words = set(context.lower().split())
    overlap = len(answer_words & context_words) / max(len(answer_words), 1)
    return round(overlap, 3)
