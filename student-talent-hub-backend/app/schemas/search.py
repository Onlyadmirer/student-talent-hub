from pydantic import BaseModel
from typing import List, Optional

class SearchUserResult(BaseModel):
    id: int
    name: str
    nim: Optional[str] = None
    major: Optional[str] = None

class SearchProjectResult(BaseModel):
    id: int
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    owner_name: str = ""

class SearchResponse(BaseModel):
    users: List[SearchUserResult] = []
    projects: List[SearchProjectResult] = []
