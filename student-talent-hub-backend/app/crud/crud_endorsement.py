from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.endorsement import Endorsement
from app.schemas.endorsement import EndorsementCreate

async def create_endorsement(db: AsyncSession, endorse: EndorsementCreate, from_user_id: int):
    db_endorse = Endorsement(
        from_user_id=from_user_id,
        to_user_id=endorse.to_user_id,
        skill_id=endorse.skill_id,
        project_id=endorse.project_id,
        message=endorse.message
    )
    db.add(db_endorse)
    await db.commit()
    await db.refresh(db_endorse)
    return db_endorse

async def get_endorsements_by_user(db: AsyncSession, user_id: int) -> List[Endorsement]:
    result = await db.execute(
        select(Endorsement)
        .options(selectinload(Endorsement.from_user), selectinload(Endorsement.skill))
        .where(Endorsement.to_user_id == user_id)
    )
    return list(result.scalars().all())

async def get_endorsements_by_project(db: AsyncSession, project_id: int) -> List[Endorsement]:
    result = await db.execute(
        select(Endorsement)
        .options(selectinload(Endorsement.from_user), selectinload(Endorsement.skill))
        .where(Endorsement.project_id == project_id)
    )
    return list(result.scalars().all())

async def get_all_endorsements(db: AsyncSession) -> List[Endorsement]:
    result = await db.execute(
        select(Endorsement)
        .options(selectinload(Endorsement.from_user), selectinload(Endorsement.skill))
    )
    return list(result.scalars().all())
