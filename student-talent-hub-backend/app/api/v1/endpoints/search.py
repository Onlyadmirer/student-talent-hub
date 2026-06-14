from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from typing import Optional

from app.api.dependencies import get_db
from app.models.user import User
from app.models.project import Project
from app.schemas.search import SearchResponse, SearchUserResult, SearchProjectResult

router = APIRouter()

@router.get("/", response_model=SearchResponse)
async def global_search(
    q: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    pattern = f"%{q}%"

    user_query = (
        select(User)
        .where(
            or_(
                User.name.ilike(pattern),
                User.major.ilike(pattern),
                User.nim.ilike(pattern),
            )
        )
        .limit(limit)
    )
    user_result = await db.execute(user_query)
    users = user_result.scalars().all()

    project_query = (
        select(Project)
        .options(selectinload(Project.owner))
        .where(
            or_(
                Project.title.ilike(pattern),
                Project.description.ilike(pattern),
            )
        )
        .limit(limit)
    )
    project_result = await db.execute(project_query)
    projects = project_result.scalars().all()

    return SearchResponse(
        users=[
            SearchUserResult(
                id=u.id,
                name=u.name,
                nim=u.nim,
                major=u.major,
            )
            for u in users
        ],
        projects=[
            SearchProjectResult(
                id=p.id,
                title=p.title,
                description=p.description,
                thumbnail_url=p.thumbnail_url,
                owner_name=p.owner_name,
            )
            for p in projects
        ],
    )
