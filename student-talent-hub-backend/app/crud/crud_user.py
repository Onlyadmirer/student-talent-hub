from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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

async def get_users(db: AsyncSession, major: Optional[str] = None, skill_id: Optional[int] = None):
    query = select(User)
    if major:
        query = query.where(User.major.ilike(f"%{major}%"))
    if skill_id:
        query = query.where(
            User.id.in_(
                select(UserSkill.user_id).where(UserSkill.skill_id == skill_id)
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
