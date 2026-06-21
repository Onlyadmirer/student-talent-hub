import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "API Student Talent & Project Hub"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/student_talent_hub")
    
    # CORS Origins (React: 3000, Vite: 5173)
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "database-gambar")
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

    class Config:
        env_file = ".env"

settings = Settings()
