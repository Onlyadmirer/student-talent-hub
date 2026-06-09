from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nim = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, index=True)
    role = Column(String, default="student")
    status = Column(String, default="active")

    projects = relationship("Project", back_populates="owner")
