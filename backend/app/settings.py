from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    groq_api_key: str | None = None
    faiss_index_path: str = "../data/index/faiss.index"
    enable_ocr: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
