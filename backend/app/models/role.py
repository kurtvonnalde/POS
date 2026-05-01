from sqlalchemy import Column, BigInteger, String, DateTime, func
from sqlalchemy.orm import relationship
from app.base import Base


class Role(Base):
    __tablename__ = "role"

    role_id = Column(BigInteger, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    # Relationship to User
    users = relationship("User", back_populates="role")
