from pydantic import BaseModel
from typing import Optional, List

class UserSkillBrief(BaseModel):
    skill_id: int
    skill_name: str
    proficiency_level: str

class UserCreate(BaseModel):
    email: str
    password: str
    nim: Optional[str] = None
    name: str
    role: str = "student"
    major: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    nim: Optional[str] = None
    major: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    nim: Optional[str]
    name: str
    role: str
    status: str
    major: Optional[str]
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    
    class Config: 
        from_attributes = True

class UserListResponse(UserResponse):
    skills: List[UserSkillBrief] = []

class Token(BaseModel):
    access_token: str
    token_type: str
