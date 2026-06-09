from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    github_link = Column(String, nullable=True)
    figma_link = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    is_open = Column(Boolean, default=True)
    status = Column(String, default="published")
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")
    contributors = relationship("ProjectContributor", back_populates="project")

class ProjectContributor(Base):
    __tablename__ = "project_contributors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id"))
    role = Column(String)

    project = relationship("Project", back_populates="contributors")
