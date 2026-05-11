from sqlalchemy import Column, String, ForeignKey, DateTime, BigInteger, func, JSON, Text
from sqlalchemy.orm import relationship
from docs.backend.app.base import Base
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_log"
    log_id = Column(BigInteger, primary_key=True)
    table_name = Column(String, nullable=False)
    record_id = Column(String, nullable=False)
    action = Column(String, nullable=False)  # INSERT, UPDATE, DELETE
    old_value = Column(JSON)
    new_value = Column(JSON)
    changed_at = Column(DateTime, default=func.now())
    user_id = Column(BigInteger, ForeignKey("app_user.user_id"))

    # Relationships
    user = relationship("User", back_populates="audit_logs")
