from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.dependencies import get_db, get_current_user
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectDetailResponse, ContributorCreate, ContributorResponse
from app.crud import crud_project
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can create projects")
    
    return await crud_project.create_project(db=db, project=project, owner_id=current_user.id)

@router.get("/", response_model=List[ProjectResponse])
async def read_projects(
    is_open: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    return await crud_project.get_projects(db=db, is_open=is_open)

@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def read_project_detail(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/contributors", response_model=ContributorResponse, status_code=status.HTTP_201_CREATED)
async def add_contributor(
    project_id: int,
    contrib: ContributorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can add contributors")
        
    return await crud_project.create_contributor(db=db, project_id=project_id, contrib=contrib)
