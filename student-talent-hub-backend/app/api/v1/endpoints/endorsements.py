from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_current_user
from app.schemas.endorsement import EndorsementCreate, EndorsementResponse
from app.crud import crud_endorsement
from app.models.user import User

router = APIRouter()

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
    return await crud_endorsement.create_endorsement(db=db, endorse=endorse, from_user_id=current_user.id)

@router.get("/user/{user_id}", response_model=List[EndorsementResponse])
async def get_user_endorsements(user_id: int, db: AsyncSession = Depends(get_db)):
    return await crud_endorsement.get_endorsements_by_user(db=db, user_id=user_id)
