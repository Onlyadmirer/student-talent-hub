from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

class SavedStudent(Base):
    __tablename__ = "saved_students"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("recruiter_id", "student_id", name="uq_recruiter_student"),
    )

    recruiter = relationship("User", foreign_keys=[recruiter_id], backref="saved_by_recruiters")
    student = relationship("User", foreign_keys=[student_id], backref="saved_students")
