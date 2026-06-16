from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(SAEnum(RequestStatus), default=RequestStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", backref="collaboration_requests")
    requester = relationship("User", backref="collaboration_requests")
