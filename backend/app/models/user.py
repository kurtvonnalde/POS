from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, BigInteger, Boolean, func
from sqlalchemy.orm import relationship
from app.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "app_user"
    user_id = Column(BigInteger, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role_id = Column(BigInteger, ForeignKey("role.role_id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationship to Role
    role = relationship("Role", back_populates="users")

