from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Dict

from app.api.dependencies import get_db, get_current_user
from app.schemas.skill import SkillCategoryCreate, SkillCategoryResponse, UserSkillCreate, UserSkillUpdate, UserSkillResponse, UserSkillWithCategoryResponse
from app.crud import crud_skill
from app.models.user import User
from app.models.skill import UserSkill, SkillCategory

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

@router.get("/user-skills/me", response_model=List[UserSkillWithCategoryResponse])
async def read_my_skills(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await crud_skill.get_user_skills_with_category(db, user_id=current_user.id)

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

@router.get("/bulk", response_model=Dict[int, List[UserSkillWithCategoryResponse]])
async def read_skills_bulk(
    user_ids: str = Query(..., description="Comma-separated user IDs"),
    db: AsyncSession = Depends(get_db),
):
    ids = [int(x.strip()) for x in user_ids.split(",") if x.strip()]
    if not ids:
        return {}
    result = await db.execute(
        select(UserSkill)
        .options(selectinload(UserSkill.skill))
        .where(UserSkill.user_id.in_(ids))
    )
    rows = result.scalars().all()
    grouped: Dict[int, List[UserSkillWithCategoryResponse]] = {}
    for r in rows:
        uid = r.user_id
        if uid not in grouped:
            grouped[uid] = []
        grouped[uid].append(
            UserSkillWithCategoryResponse(
                id=r.id,
                user_id=r.user_id,
                skill_id=r.skill_id,
                proficiency_level=r.proficiency_level,
                skill_name=r.skill.name if r.skill else "",
            )
        )
    return grouped

# --- Aliases for frontend-new compatibility ---

@router.get("/", response_model=List[SkillCategoryResponse])
async def get_categories_alias(db: AsyncSession = Depends(get_db)):
    return await crud_skill.get_skills(db=db)

@router.get("/users/me", response_model=List[UserSkillWithCategoryResponse])
async def read_my_skills_alias(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await crud_skill.get_user_skills_with_category(db, user_id=current_user.id)

@router.post("/users/me", response_model=UserSkillResponse)
async def claim_user_skill_alias(
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

@router.patch("/users/me/{skill_id}", response_model=UserSkillResponse)
async def update_my_skill(
    skill_id: int,
    update_data: UserSkillUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_skill = await crud_skill.get_user_skill(db, user_id=current_user.id, skill_id=skill_id)
    if not user_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return await crud_skill.update_user_skill(db=db, user_skill=user_skill, update_data=update_data.model_dump(exclude_unset=True))

@router.delete("/users/me/{skill_id}")
async def delete_my_skill_alias(
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

@router.get("/users/{user_id}", response_model=List[UserSkillWithCategoryResponse])
async def read_user_skills(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await crud_skill.get_user_skills_with_category(db, user_id=user_id)
