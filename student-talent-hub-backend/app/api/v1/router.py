from fastapi import APIRouter
from app.api.v1.endpoints import users, skills, projects, endorsements

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(skills.router, prefix="/skills", tags=["skills"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(endorsements.router, prefix="/endorsements", tags=["endorsements"])
