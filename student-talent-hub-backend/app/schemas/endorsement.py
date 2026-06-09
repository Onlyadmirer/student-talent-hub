from pydantic import BaseModel
from typing import Optional

class EndorsementCreate(BaseModel):
    to_user_id: int
    skill_id: Optional[int] = None
    project_id: Optional[int] = None
    message: str

class EndorsementResponse(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    skill_id: Optional[int] = None
    project_id: Optional[int] = None
    message: str
    
    class Config:
        from_attributes = True
