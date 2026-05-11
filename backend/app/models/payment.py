from sqlalchemy import Column, String, Float, ForeignKey, DateTime, BigInteger, func, Numeric
from sqlalchemy.orm import relationship
from docs.backend.app.base import Base
from datetime import datetime

class Payment(Base):
    __tablename__ = "payment"
    payment_id = Column(BigInteger, primary_key=True)
    sale_id = Column(BigInteger, ForeignKey("sale.sale_id"), nullable=False)
    payment_method = Column(String, nullable=False)  # cash, card, cheque, online
    amount = Column(Numeric(12, 2), nullable=False)
    reference_no = Column(String)
    payment_date = Column(DateTime, default=func.now())
    currency = Column(String, default="USD")
    created_at = Column(DateTime, default=func.now())

    # Relationships
    sale = relationship("Sale", back_populates="payments")
