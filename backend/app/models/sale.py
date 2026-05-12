from sqlalchemy import Column, String, Float, ForeignKey, DateTime, BigInteger, func
from sqlalchemy.orm import relationship
from app.base import Base
from datetime import datetime

class Sale(Base):
    __tablename__ = "sale"
    sale_id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("app_user.user_id"), nullable=False)
    sale_date = Column(DateTime, default=func.now())
    subtotal = Column(Float, nullable=False, default=0.0)
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    status = Column(String, default="completed", nullable=False)  # completed, pending, cancelled
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="sales")
    sale_items = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="sale", cascade="all, delete-orphan")
