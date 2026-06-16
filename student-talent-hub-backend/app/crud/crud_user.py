from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import Optional
from app.models.user import User
from app.models.skill import UserSkill
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def get_user_by_nim(db: AsyncSession, nim: str):
    result = await db.execute(select(User).where(User.nim == nim))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    user_data = user.model_dump()
    user_data.pop("password")
    db_user = User(**user_data, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()

async def get_users(db: AsyncSession, major: Optional[str] = None, skill_id: Optional[int] = None, proficiency_level: Optional[str] = None):
    query = select(User).where(User.role == "student", User.status == "active")
    if major:
        query = query.where(User.major.ilike(f"%{major}%"))
    if skill_id:
        query = query.where(
            User.id.in_(
                select(UserSkill.user_id).where(UserSkill.skill_id == skill_id)
            )
        )
    if proficiency_level:
        query = query.where(
            User.id.in_(
                select(UserSkill.user_id).where(UserSkill.proficiency_level == proficiency_level)
            )
        )
    result = await db.execute(query)
    return result.scalars().all()

async def update_user(db: AsyncSession, user: User, update_data: dict):
    for field, value in update_data.items():
        if value is not None:
            setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user

async def delete_user(db: AsyncSession, user: User):
    await db.execute(
        delete(UserSkill).where(UserSkill.user_id == user.id)
    )
    from app.models.project import Project, ProjectContributor
    await db.execute(
        delete(ProjectContributor).where(ProjectContributor.user_id == user.id)
    )
    child_projects = await db.execute(
        select(Project.id).where(Project.owner_id == user.id)
    )
    child_ids = [row[0] for row in child_projects.all()]
    if child_ids:
        await db.execute(
            delete(ProjectContributor).where(ProjectContributor.project_id.in_(child_ids))
        )
        from app.models.endorsement import Endorsement
        await db.execute(
            delete(Endorsement).where(Endorsement.project_id.in_(child_ids))
        )
        from app.models.collaboration_request import CollaborationRequest
        await db.execute(
            delete(CollaborationRequest).where(CollaborationRequest.project_id.in_(child_ids))
        )
        await db.execute(
            delete(Project).where(Project.owner_id == user.id)
        )
    from app.models.endorsement import Endorsement as End
    await db.execute(
        delete(End).where((End.from_user_id == user.id) | (End.to_user_id == user.id))
    )
    from app.models.collaboration_request import CollaborationRequest as CR
    await db.execute(
        delete(CR).where(CR.requester_id == user.id)
    )
    await db.delete(user)
    await db.commit()
