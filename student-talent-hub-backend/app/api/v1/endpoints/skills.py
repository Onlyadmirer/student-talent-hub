from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.schemas.skill import SkillCategoryCreate, SkillCategoryResponse, UserSkillCreate, UserSkillResponse
from app.crud import crud_skill
from app.models.user import User

router = APIRouter()

@router.post("/categories", response_model=SkillCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    skill: SkillCategoryCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return await crud_skill.create_skill(db=db, skill=skill)

@router.get("/categories", response_model=List[SkillCategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await crud_skill.get_skills(db=db)

@router.post("/user-skills", response_model=UserSkillResponse)
async def claim_user_skill(
    user_skill: UserSkillCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can claim skills")
    
    existing_skill = await crud_skill.get_user_skill(db, user_id=current_user.id, skill_id=user_skill.skill_id)
    if existing_skill:
        raise HTTPException(status_code=400, detail="Skill already claimed")
    
    return await crud_skill.create_user_skill(db=db, user_id=current_user.id, user_skill=user_skill)

@router.delete("/user-skills/{skill_id}")
async def delete_user_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can delete skills")
    
    success = await crud_skill.delete_user_skill(db=db, user_id=current_user.id, skill_id=skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    return {"message": "Skill successfully deleted"}
