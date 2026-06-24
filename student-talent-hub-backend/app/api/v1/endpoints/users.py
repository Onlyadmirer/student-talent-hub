import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api.dependencies import get_db, get_current_user
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.crud import crud_user
from app.schemas.user import UserCreate, UserUpdate, UserResponse, Token
from app.schemas.dashboard import DashboardSummaryResponse
from app.models.user import User
from app.models.project import Project
from app.models.skill import UserSkill
from app.models.endorsement import Endorsement

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    if len(user_in.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    user = await crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user_in.nim:
        user_nim = await crud_user.get_user_by_nim(db, nim=user_in.nim)
        if user_nim:
            raise HTTPException(status_code=400, detail="NIM already registered")
    
    new_user = await crud_user.create_user(db, user=user_in)
    return new_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_user_by_email(db, email=form_data.username)
    if not user:
        user = await crud_user.get_user_by_nim(db, nim=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect NIM/email or password")
    
    if user.status == "banned":
        raise HTTPException(status_code=403, detail="Your account has been banned")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    update_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filtered = update_data.model_dump(exclude_unset=True)
    if not filtered:
        raise HTTPException(status_code=400, detail="No fields to update")

    if "nim" in filtered and filtered["nim"] is not None:
        existing = await crud_user.get_user_by_nim(db, nim=filtered["nim"])
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="NIM already taken")

    updated = await crud_user.update_user(db, current_user, filtered)
    return updated

@router.post("/me/profile-picture", response_model=UserResponse)
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}")

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE // (1024*1024)}MB")

    filename = f"{uuid.uuid4().hex}{ext}"
    upload_path = os.path.join(settings.UPLOAD_DIR, "profiles", filename)

    with open(upload_path, "wb") as f:
        f.write(contents)

    old_file = current_user.profile_picture
    if old_file and old_file.startswith("/database-gambar/profiles/"):
        old_path = os.path.join(settings.UPLOAD_DIR, old_file.replace("/database-gambar/", ""))
        if os.path.exists(old_path):
            os.remove(old_path)

    current_user.profile_picture = f"/database-gambar/profiles/{filename}"
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
async def read_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = await crud_user.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/me/dashboard-summary", response_model=DashboardSummaryResponse)
@router.get("/me/dashboard-stats", response_model=DashboardSummaryResponse)
async def read_user_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_projects_query = select(func.count(Project.id)).where(Project.owner_id == current_user.id)
    total_projects_result = await db.execute(total_projects_query)
    total_projects = total_projects_result.scalar_one()

    total_skills_query = select(func.count(UserSkill.id)).where(UserSkill.user_id == current_user.id)
    total_skills_result = await db.execute(total_skills_query)
    total_skills = total_skills_result.scalar_one()

    total_endorsements_query = select(func.count(Endorsement.id)).where(Endorsement.to_user_id == current_user.id)
    total_endorsements_result = await db.execute(total_endorsements_query)
    total_endorsements = total_endorsements_result.scalar_one()

    recent_projects_query = (
        select(Project)
        .where(Project.owner_id == current_user.id)
        .order_by(Project.id.desc())
        .limit(2)
    )
    recent_projects_result = await db.execute(recent_projects_query)
    recent_projects = recent_projects_result.scalars().all()

    return DashboardSummaryResponse(
        total_projects=total_projects,
        total_skills=total_skills,
        total_endorsements=total_endorsements,
        recent_projects=recent_projects,
    )

@router.get("/by-nim/{nim}", response_model=UserResponse)
async def read_user_by_nim(
    nim: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = await crud_user.get_user_by_nim(db, nim=nim)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    major: Optional[str] = Query(None, description="Filter by major"),
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    proficiency_level: Optional[str] = Query(None, description="Filter by proficiency level"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = await crud_user.get_users(db, major=major, skill_id=skill_id, proficiency_level=proficiency_level)
    return users
