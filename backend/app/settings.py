# backend/app/settings.py
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# Make sure .env is loaded manually (Windows safe)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

class Settings(BaseSettings):
    groq_api_key: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"

# ✅ instantiate the settings object so main.py can import it
settings = Settings()
