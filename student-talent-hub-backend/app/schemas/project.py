from pydantic import BaseModel
from typing import List, Optional


class NestedUser(BaseModel):
    id: int
    name: str
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectCreateBase(BaseModel):
    title: str
    description: str
    github_link: Optional[str] = None
    figma_link: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_open: bool = True

class ProjectCreate(ProjectCreateBase):
    pass

class ProjectResponse(ProjectCreateBase):
    id: int
    status: str
    owner_id: int
    owner_name: str = ""
    
    class Config: 
        from_attributes = True

class ContributorCreateBase(BaseModel):
    user_id: int
    role: str

class ContributorCreate(ContributorCreateBase):
    pass

class ContributorResponse(ContributorCreateBase):
    id: int
    project_id: int
    user_name: str = ""
    
    class Config: 
        from_attributes = True

class ContributorWithUserResponse(ContributorResponse):
    user: Optional[NestedUser] = None

    class Config:
        from_attributes = True

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    github_link: Optional[str] = None
    figma_link: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_open: Optional[bool] = None
    status: Optional[str] = None

class CollaborationRequestCreate(BaseModel):
    role: str
    message: Optional[str] = None

class CollaborationRequestResponse(BaseModel):
    id: int
    project_id: int
    requester_id: int
    role: str
    message: Optional[str] = None
    status: str
    created_at: Optional[str] = None
    requester_name: str = ""
    requester_nim: Optional[str] = None

class CollaborationRequestUpdate(BaseModel):
    status: str

class ProjectDetailResponse(ProjectResponse):
    contributors: List[ContributorResponse] = []
    owner_name: str = ""
    owner_profile_picture: Optional[str] = None
    
    class Config: 
        from_attributes = True
