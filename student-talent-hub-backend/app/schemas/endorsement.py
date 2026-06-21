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
    from_user_name: str = ""
    from_user_profile_picture: Optional[str] = None
    
    class Config:
        from_attributes = True
