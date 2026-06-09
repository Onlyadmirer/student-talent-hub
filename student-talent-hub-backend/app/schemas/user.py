from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    email: str
    password: str
    nim: Optional[str] = None
    name: str
    role: str = "student"

class UserResponse(BaseModel):
    id: int
    email: str
    nim: Optional[str]
    name: str
    role: str
    status: str
    
    class Config: 
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
