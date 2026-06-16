from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import Optional
from app.models.collaboration_request import CollaborationRequest, RequestStatus
from app.schemas.project import CollaborationRequestCreate

async def create_request(
    db: AsyncSession,
    project_id: int,
    requester_id: int,
    req_data: CollaborationRequestCreate,
):
    db_req = CollaborationRequest(
        project_id=project_id,
        requester_id=requester_id,
        role=req_data.role,
        message=req_data.message,
        status=RequestStatus.pending,
    )
    db.add(db_req)
    await db.commit()
    await db.refresh(db_req)
    return db_req

async def get_pending_request(
    db: AsyncSession,
    project_id: int,
    requester_id: int,
):
    result = await db.execute(
        select(CollaborationRequest).where(
            and_(
                CollaborationRequest.project_id == project_id,
                CollaborationRequest.requester_id == requester_id,
                CollaborationRequest.status == RequestStatus.pending,
            )
        )
    )
    return result.scalar_one_or_none()

async def get_requests_for_project(
    db: AsyncSession,
    project_id: int,
    status: Optional[str] = None,
):
    query = (
        select(CollaborationRequest)
        .options(selectinload(CollaborationRequest.requester))
        .where(CollaborationRequest.project_id == project_id)
    )
    if status:
        query = query.where(CollaborationRequest.status == status)
    query = query.order_by(CollaborationRequest.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def get_request_by_id(db: AsyncSession, request_id: int):
    query = (
        select(CollaborationRequest)
        .options(selectinload(CollaborationRequest.requester))
        .where(CollaborationRequest.id == request_id)
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def update_request_status(db: AsyncSession, db_req: CollaborationRequest, new_status: str):
    db_req.status = RequestStatus(new_status)
    await db.commit()
    await db.refresh(db_req)
    return db_req

async def get_my_requests(db: AsyncSession, requester_id: int):
    query = (
        select(CollaborationRequest)
        .options(selectinload(CollaborationRequest.project))
        .where(CollaborationRequest.requester_id == requester_id)
        .order_by(CollaborationRequest.created_at.desc())
    )
    result = await db.execute(query)
    return result.scalars().all()
