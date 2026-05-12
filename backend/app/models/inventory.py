from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, BigInteger, func
from sqlalchemy.orm import relationship
from app.base import Base
from datetime import datetime

class Inventory(Base):
    __tablename__ = "inventory"
    inventory_id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, ForeignKey("product.product_id"), nullable=False)
    quantity_on_hand = Column(Integer, nullable=False, default=0)
    reorder_level = Column(Integer, nullable=False, default=10)
    warehouse = Column(String, nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    product = relationship("Product", back_populates="inventory")
