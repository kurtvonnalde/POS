from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, BigInteger, func
from sqlalchemy.orm import relationship
from docs.backend.app.base import Base
from datetime import datetime

class PurchaseItem(Base):
    __tablename__ = "purchase_item"
    purchase_item_id = Column(BigInteger, primary_key=True)
    purchase_id = Column(BigInteger, ForeignKey("purchase.purchase_id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("product.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    purchase = relationship("Purchase", back_populates="purchase_items")
    product = relationship("Product", back_populates="purchase_items")
