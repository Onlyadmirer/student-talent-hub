import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.router import api_router
from app.db.database import engine
from app.db.base import Base
from app.core.config import settings
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Memastikan tabel terbuat di PostgreSQL secara asinkron
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="API Student Talent & Project Hub", lifespan=lifespan)

# Konfigurasi CORS untuk frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sajikan folder database-gambar sebagai static files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "profiles"), exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "thumbnails"), exist_ok=True)
app.mount("/database-gambar", StaticFiles(directory=settings.UPLOAD_DIR), name="database-gambar")

app.include_router(api_router, prefix="/api")

@app.get("/")
def baca_root():
    return {"Pesan": "API Student Talent & Project Hub Berjalan Lancar!"}
