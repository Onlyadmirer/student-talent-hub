from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.api.dependencies import get_db, get_current_user
from app.schemas.user import UserResponse
from app.schemas.project import ProjectResponse
from app.schemas.skill import SkillCategoryResponse, SkillCategoryCreate
from app.crud import crud_user, crud_project, crud_skill
from app.models.user import User
from app.models.project import Project
from app.models.skill import SkillCategory, UserSkill
from app.models.endorsement import Endorsement

router = APIRouter()

async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

@router.get("/dashboard")
async def admin_dashboard(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_projects = (await db.execute(select(func.count(Project.id)))).scalar_one()
    total_skills = (await db.execute(select(func.count(SkillCategory.id)))).scalar_one()
    total_endorsements = (await db.execute(select(func.count(Endorsement.id)))).scalar_one()
    total_students = (await db.execute(select(func.count(User.id)).where(User.role == "student"))).scalar_one()
    total_recruiters = (await db.execute(select(func.count(User.id)).where(User.role == "recruiter"))).scalar_one()
    open_projects = (await db.execute(select(func.count(Project.id)).where(Project.is_open == True))).scalar_one()

    recent_users = (
        (await db.execute(select(User).order_by(User.id.desc()).limit(5))).scalars().all()
    )

    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_recruiters": total_recruiters,
        "total_projects": total_projects,
        "open_projects": open_projects,
        "total_skills": total_skills,
        "total_endorsements": total_endorsements,
        "recent_users": [UserResponse.model_validate(u) for u in recent_users],
    }

@router.get("/users", response_model=List[UserResponse])
async def admin_list_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    users = await crud_user.get_users(db)
    return users

@router.patch("/users/{user_id}/status", response_model=UserResponse)
async def admin_update_user_status(
    user_id: int,
    body: dict,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    new_status = body.get("status")
    if new_status not in ("active", "banned"):
        raise HTTPException(status_code=400, detail="Status must be 'active' or 'banned'")

    user = await crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own status")

    updated = await crud_user.update_user(db, user, {"status": new_status})
    return updated

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    user = await crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await crud_user.delete_user(db, user)

@router.get("/projects", response_model=List[ProjectResponse])
async def admin_list_projects(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return await crud_project.get_projects(db)

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    project = await crud_project.get_project_by_id(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await crud_project.delete_project(db, project)

@router.get("/skills/categories", response_model=List[SkillCategoryResponse])
async def admin_list_skill_categories(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return await crud_skill.get_skills(db)

@router.post("/skills/categories", response_model=SkillCategoryResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_skill_category(
    skill: SkillCategoryCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return await crud_skill.create_skill(db, skill)

@router.delete("/skills/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_skill_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    deleted = await crud_skill.delete_skill_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Skill category not found")
