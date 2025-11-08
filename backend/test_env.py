import os
from app.settings import settings

print("From os.environ:", os.getenv("GROQ_API_KEY"))
print("From pydantic:", settings.groq_api_key)
