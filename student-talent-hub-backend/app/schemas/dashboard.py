from pydantic import BaseModel
from typing import List

from app.schemas.project import ProjectResponse


class DashboardSummaryResponse(BaseModel):
    total_projects: int
    total_skills: int
    total_endorsements: int
    recent_projects: List[ProjectResponse]

    class Config:
        from_attributes = True
