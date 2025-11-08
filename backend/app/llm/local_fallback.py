"""
backend/app/llm/local_fallback.py
Lightweight local fallback using Hugging Face Transformers.
"""

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

def load_local_model(model_name="mistralai/Mistral-7B-Instruct-v0.3"):
    print(f"🔹 Loading local fallback model: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
    return tokenizer, model

def generate_answer_local(tokenizer, model, context: str, query: str):
    prompt = f"Context:\n{context}\n\nQuestion: {query}\nAnswer concisely and factually."
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True)
    outputs = model.generate(**inputs, max_new_tokens=256)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
