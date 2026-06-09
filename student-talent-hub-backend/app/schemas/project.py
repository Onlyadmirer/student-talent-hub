from pydantic import BaseModel
from typing import List, Optional

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
    
    class Config: 
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    contributors: List[ContributorResponse] = []
    
    class Config: 
        from_attributes = True
