from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from app.models.skill import SkillCategory, UserSkill
from app.schemas.skill import SkillCategoryCreate, UserSkillCreate, UserSkillWithCategoryResponse

async def create_skill(db: AsyncSession, skill: SkillCategoryCreate):
    db_skill = SkillCategory(**skill.model_dump())
    db.add(db_skill)
    await db.commit()
    await db.refresh(db_skill)
    return db_skill

async def get_skills(db: AsyncSession):
    result = await db.execute(select(SkillCategory))
    return result.scalars().all()

async def get_user_skill(db: AsyncSession, user_id: int, skill_id: int):
    result = await db.execute(
        select(UserSkill).where(
            and_(UserSkill.user_id == user_id, UserSkill.skill_id == skill_id)
        )
    )
    return result.scalars().first()

async def create_user_skill(db: AsyncSession, user_id: int, user_skill: UserSkillCreate):
    db_user_skill = UserSkill(
        user_id=user_id,
        skill_id=user_skill.skill_id,
        proficiency_level=user_skill.proficiency_level.value
    )
    db.add(db_user_skill)
    await db.commit()
    await db.refresh(db_user_skill)
    return db_user_skill

async def delete_user_skill(db: AsyncSession, user_id: int, skill_id: int):
    db_user_skill = await get_user_skill(db, user_id, skill_id)
    if db_user_skill:
        await db.delete(db_user_skill)
        await db.commit()
        return True
    return False

async def update_user_skill(db: AsyncSession, user_skill: UserSkill, update_data: dict):
    for field, value in update_data.items():
        if value is not None:
            setattr(user_skill, field, value)
    await db.commit()
    await db.refresh(user_skill)
    return user_skill

async def get_user_skills_with_category(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(
            UserSkill.id,
            UserSkill.user_id,
            UserSkill.skill_id,
            UserSkill.proficiency_level,
            SkillCategory.name.label("skill_name"),
        )
        .join(SkillCategory, UserSkill.skill_id == SkillCategory.id)
        .where(UserSkill.user_id == user_id)
    )
    rows = result.all()
    return [
        UserSkillWithCategoryResponse(
            id=row.id,
            user_id=row.user_id,
            skill_id=row.skill_id,
            proficiency_level=row.proficiency_level,
            skill_name=row.skill_name,
        )
        for row in rows
    ]
