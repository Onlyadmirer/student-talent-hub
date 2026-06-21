from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Endorsement(Base):
    __tablename__ = "endorsements"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"))
    to_user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skill_categories.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    message = Column(Text)

    from_user = relationship("User", foreign_keys=[from_user_id])
    skill = relationship("SkillCategory")
