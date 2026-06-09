from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional
from app.models.project import Project, ProjectContributor
from app.schemas.project import ProjectCreate, ContributorCreate

async def create_project(db: AsyncSession, project: ProjectCreate, owner_id: int):
    db_project = Project(**project.model_dump(), owner_id=owner_id, status="published")
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    return db_project

async def get_projects(db: AsyncSession, is_open: Optional[bool] = None):
    query = select(Project)
    if is_open is not None:
        query = query.where(Project.is_open == is_open)
    result = await db.execute(query)
    return result.scalars().all()

async def get_project_by_id(db: AsyncSession, project_id: int):
    query = select(Project).options(selectinload(Project.contributors)).where(Project.id == project_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def create_contributor(db: AsyncSession, project_id: int, contrib: ContributorCreate):
    db_contrib = ProjectContributor(project_id=project_id, **contrib.model_dump())
    db.add(db_contrib)
    await db.commit()
    await db.refresh(db_contrib)
    return db_contrib
