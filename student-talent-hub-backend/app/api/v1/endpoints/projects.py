import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.dependencies import get_db, get_current_user
from app.core.config import settings
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse,
    ContributorCreate, ContributorResponse, ContributorWithUserResponse,
    CollaborationRequestCreate, CollaborationRequestResponse, CollaborationRequestUpdate,
)
from app.crud import crud_project, crud_collaboration_request
from app.models.user import User
from app.models.project import Project
from app.models.collaboration_request import RequestStatus

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

@router.get("/me", response_model=List[ProjectResponse])
async def read_my_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await crud_project.get_user_projects(db, owner_id=current_user.id)

@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def read_project_detail(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    owner_profile_picture = project.owner.profile_picture if project.owner else None
    return ProjectDetailResponse(
        id=project.id,
        title=project.title,
        description=project.description,
        github_link=project.github_link,
        figma_link=project.figma_link,
        thumbnail_url=project.thumbnail_url,
        is_open=project.is_open,
        status=project.status,
        owner_id=project.owner_id,
        owner_name=project.owner_name,
        owner_profile_picture=owner_profile_picture,
        contributors=project.contributors,
    )

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    update_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can update this project")

    filtered = update_data.model_dump(exclude_unset=True)
    if not filtered:
        raise HTTPException(status_code=400, detail="No fields to update")

    return await crud_project.update_project(db=db, project=project, update_data=filtered)

@router.post("/{project_id}/thumbnail", response_model=ProjectResponse)
async def upload_project_thumbnail(
    project_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can update the thumbnail")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}")

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE // (1024*1024)}MB")

    filename = f"{uuid.uuid4().hex}{ext}"
    upload_path = os.path.join(settings.UPLOAD_DIR, "thumbnails", filename)

    with open(upload_path, "wb") as f:
        f.write(contents)

    old_file = project.thumbnail_url
    if old_file and old_file.startswith("/database-gambar/thumbnails/"):
        old_path = os.path.join(settings.UPLOAD_DIR, old_file.replace("/database-gambar/", ""))
        if os.path.exists(old_path):
            os.remove(old_path)

    project.thumbnail_url = f"/database-gambar/thumbnails/{filename}"
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can delete this project")

    await crud_project.delete_project(db=db, project=project)

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

@router.get("/{project_id}/contributors", response_model=List[ContributorWithUserResponse])
async def read_project_contributors(
    project_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await crud_project.get_project_contributors(db, project_id)

@router.delete("/{project_id}/contributors/{contributor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_contributor(
    project_id: int,
    contributor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can remove contributors")

    deleted = await crud_project.delete_contributor(db, contributor_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Contributor not found")

@router.post("/{project_id}/requests", response_model=CollaborationRequestResponse, status_code=status.HTTP_201_CREATED)
async def send_collaboration_request(
    project_id: int,
    req_data: CollaborationRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can send collaboration requests")

    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot request to collaborate on your own project")
    if not project.is_open:
        raise HTTPException(status_code=400, detail="This project is not open for collaboration")

    existing_contrib = await crud_project.get_contributor_by_user_and_project(db, current_user.id, project_id)
    if existing_contrib:
        raise HTTPException(status_code=400, detail="You are already a contributor of this project")

    existing = await crud_collaboration_request.get_pending_request(db, project_id, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending request for this project")

    requester_name = current_user.name or ""
    requester_nim = current_user.nim

    db_req = await crud_collaboration_request.create_request(db, project_id, current_user.id, req_data)
    return CollaborationRequestResponse(
        id=db_req.id,
        project_id=db_req.project_id,
        requester_id=db_req.requester_id,
        role=db_req.role,
        message=db_req.message,
        status=getattr(db_req.status, 'value', str(db_req.status)),
        created_at=str(db_req.created_at) if db_req.created_at else None,
        requester_name=requester_name,
        requester_nim=requester_nim,
    )

@router.get("/{project_id}/requests", response_model=List[CollaborationRequestResponse])
async def read_project_requests(
    project_id: int,
    status_filter: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can view requests")

    requests = await crud_collaboration_request.get_requests_for_project(db, project_id, status_filter)
    result = []
    for req in requests:
        result.append(CollaborationRequestResponse(
            id=req.id,
            project_id=req.project_id,
            requester_id=req.requester_id,
            role=req.role,
            message=req.message,
            status=getattr(req.status, 'value', str(req.status)),
            created_at=str(req.created_at) if req.created_at else None,
            requester_name=req.requester.name if req.requester else "",
            requester_nim=req.requester.nim if req.requester else None,
        ))
    return result

@router.patch("/{project_id}/requests/{request_id}", response_model=CollaborationRequestResponse)
async def update_collaboration_request(
    project_id: int,
    request_id: int,
    update_data: CollaborationRequestUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await crud_project.get_project_by_id(db=db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can manage requests")

    db_req = await crud_collaboration_request.get_request_by_id(db, request_id)
    if db_req is None or db_req.project_id != project_id:
        raise HTTPException(status_code=404, detail="Request not found")
    if db_req.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Request is no longer pending")

    new_status = update_data.status
    if new_status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")

    requester = db_req.requester
    requester_name = requester.name if requester else ""
    requester_nim = requester.nim if requester else None

    await crud_collaboration_request.update_request_status(db, db_req, new_status)

    req_id = db_req.id
    req_project_id = db_req.project_id
    req_requester_id = db_req.requester_id
    req_role = db_req.role
    req_message = db_req.message
    req_status = getattr(db_req.status, 'value', str(db_req.status))
    req_created_at = str(db_req.created_at) if db_req.created_at else None

    if new_status == "accepted":
        from app.schemas.project import ContributorCreate
        await crud_project.create_contributor(
            db=db,
            project_id=project_id,
            contrib=ContributorCreate(user_id=req_requester_id, role=req_role),
        )

    return CollaborationRequestResponse(
        id=req_id,
        project_id=req_project_id,
        requester_id=req_requester_id,
        role=req_role,
        message=req_message,
        status=req_status,
        created_at=req_created_at,
        requester_name=requester_name,
        requester_nim=requester_nim,
    )

@router.delete("/{project_id}/requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_collaboration_request(
    project_id: int,
    request_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_req = await crud_collaboration_request.get_request_by_id(db, request_id)
    if db_req is None or db_req.project_id != project_id:
        raise HTTPException(status_code=404, detail="Request not found")
    if db_req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only cancel your own requests")
    if db_req.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Can only cancel pending requests")

    await db.delete(db_req)
    await db.commit()

@router.get("/requests/me", response_model=List[CollaborationRequestResponse])
async def read_my_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    requests = await crud_collaboration_request.get_my_requests(db, current_user.id)
    result = []
    for req in requests:
        result.append(CollaborationRequestResponse(
            id=req.id,
            project_id=req.project_id,
            requester_id=req.requester_id,
            role=req.role,
            message=req.message,
            status=getattr(req.status, 'value', str(req.status)),
            created_at=str(req.created_at) if req.created_at else None,
            requester_name=current_user.name or "",
            requester_nim=current_user.nim,
        ))
    return result
