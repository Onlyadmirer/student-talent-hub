from pydantic import BaseModel
from enum import Enum

class ProficiencyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"

class SkillCategoryCreate(BaseModel):
    name: str
    description: str

class SkillCategoryResponse(BaseModel):
    id: int
    name: str
    description: str
    
    class Config: 
        from_attributes = True

class UserSkillCreate(BaseModel):
    skill_id: int
    proficiency_level: ProficiencyLevel

class UserSkillResponse(BaseModel):
    id: int
    user_id: int
    skill_id: int
    proficiency_level: ProficiencyLevel

    class Config:
        from_attributes = True
