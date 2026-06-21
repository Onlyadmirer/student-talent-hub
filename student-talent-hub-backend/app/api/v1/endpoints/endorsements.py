from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user
from app.schemas.endorsement import EndorsementCreate, EndorsementResponse
from app.crud import crud_endorsement
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[EndorsementResponse])
async def list_endorsements(
    user_id: Optional[int] = Query(None),
    project_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    if project_id is not None:
        endorsements = await crud_endorsement.get_endorsements_by_project(db=db, project_id=project_id)
    elif user_id is not None:
        endorsements = await crud_endorsement.get_endorsements_by_user(db=db, user_id=user_id)
    else:
        endorsements = await crud_endorsement.get_all_endorsements(db=db)
    return [
        EndorsementResponse(
            id=e.id,
            from_user_id=e.from_user_id,
            to_user_id=e.to_user_id,
            skill_id=e.skill_id,
            project_id=e.project_id,
            message=e.message,
            from_user_name=e.from_user.name if e.from_user else "",
            from_user_profile_picture=e.from_user.profile_picture if e.from_user else None,
        )
        for e in endorsements
    ]

@router.post("/", response_model=EndorsementResponse)
async def create_endorsement_endpoint(
    endorse: EndorsementCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == endorse.to_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot endorse yourself"
        )
    db_endorse = await crud_endorsement.create_endorsement(db=db, endorse=endorse, from_user_id=current_user.id)
    return EndorsementResponse(
        id=db_endorse.id,
        from_user_id=db_endorse.from_user_id,
        to_user_id=db_endorse.to_user_id,
        skill_id=db_endorse.skill_id,
        project_id=db_endorse.project_id,
        message=db_endorse.message,
        from_user_name=current_user.name,
        from_user_profile_picture=current_user.profile_picture,
    )

@router.get("/user/{user_id}", response_model=List[EndorsementResponse])
async def get_user_endorsements(user_id: int, db: AsyncSession = Depends(get_db)):
    endorsements = await crud_endorsement.get_endorsements_by_user(db=db, user_id=user_id)
    return [
        EndorsementResponse(
            id=e.id,
            from_user_id=e.from_user_id,
            to_user_id=e.to_user_id,
            skill_id=e.skill_id,
            project_id=e.project_id,
            message=e.message,
            from_user_name=e.from_user.name if e.from_user else "",
            from_user_profile_picture=e.from_user.profile_picture if e.from_user else None,
        )
        for e in endorsements
    ]
