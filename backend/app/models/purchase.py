from sqlalchemy import Column, String, Float, ForeignKey, DateTime, BigInteger, func
from sqlalchemy.orm import relationship
from docs.backend.app.base import Base
from datetime import datetime

class Purchase(Base):
    __tablename__ = "purchase"
    purchase_id = Column(BigInteger, primary_key=True)
    supplier_id = Column(BigInteger, ForeignKey("supplier.supplier_id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("app_user.user_id"), nullable=False)
    total_cost = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=func.now())
    status = Column(String, default="pending", nullable=False)  # pending, completed, cancelled
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    supplier = relationship("Supplier", back_populates="purchases")
    user = relationship("User", back_populates="purchases")
    purchase_items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")
