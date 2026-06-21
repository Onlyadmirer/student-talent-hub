from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from typing import Optional
from app.models.project import Project, ProjectContributor
from app.models.endorsement import Endorsement
from app.schemas.project import ProjectCreate, ContributorCreate

async def create_project(db: AsyncSession, project: ProjectCreate, owner_id: int):
    db_project = Project(**project.model_dump(), owner_id=owner_id, status="published")
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    await db.refresh(db_project, ["owner"])
    return db_project

async def get_projects(db: AsyncSession, is_open: Optional[bool] = None):
    query = select(Project).options(selectinload(Project.owner))
    if is_open is not None:
        query = query.where(Project.is_open == is_open)
    result = await db.execute(query)
    return result.scalars().all()

async def get_project_by_id(db: AsyncSession, project_id: int):
    query = (
        select(Project)
        .options(
            selectinload(Project.contributors).selectinload(ProjectContributor.user),
            selectinload(Project.owner),
        )
        .where(Project.id == project_id)
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def get_contributor_by_user_and_project(db: AsyncSession, user_id: int, project_id: int):
    result = await db.execute(
        select(ProjectContributor).where(
            ProjectContributor.user_id == user_id,
            ProjectContributor.project_id == project_id
        )
    )
    return result.scalar_one_or_none()

async def create_contributor(db: AsyncSession, project_id: int, contrib: ContributorCreate):
    db_contrib = ProjectContributor(project_id=project_id, **contrib.model_dump())
    db.add(db_contrib)
    await db.commit()
    await db.refresh(db_contrib)
    return db_contrib

async def get_project_contributors(db: AsyncSession, project_id: int):
    result = await db.execute(
        select(ProjectContributor)
        .options(selectinload(ProjectContributor.user))
        .where(ProjectContributor.project_id == project_id)
    )
    return result.scalars().all()

async def delete_contributor(db: AsyncSession, contributor_id: int):
    result = await db.execute(
        select(ProjectContributor).where(ProjectContributor.id == contributor_id)
    )
    db_contrib = result.scalar_one_or_none()
    if db_contrib:
        await db.delete(db_contrib)
        await db.commit()
    return db_contrib

async def get_user_projects(db: AsyncSession, owner_id: int):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.owner))
        .where(Project.owner_id == owner_id)
        .order_by(Project.id.desc())
    )
    return result.scalars().all()

async def update_project(db: AsyncSession, project: Project, update_data: dict):
    for field, value in update_data.items():
        if value is not None:
            setattr(project, field, value)
    await db.commit()
    await db.refresh(project)
    await db.refresh(project, ["owner"])
    return project

async def delete_project(db: AsyncSession, project: Project):
    await db.execute(
        delete(ProjectContributor).where(ProjectContributor.project_id == project.id)
    )
    await db.execute(
        delete(Endorsement).where(Endorsement.project_id == project.id)
    )
    await db.delete(project)
    await db.commit()
