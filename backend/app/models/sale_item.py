from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, BigInteger, func
from sqlalchemy.orm import relationship
from docs.backend.app.base import Base
from datetime import datetime

class SaleItem(Base):
    __tablename__ = "sale_item"
    sale_item_id = Column(BigInteger, primary_key=True)
    sale_id = Column(BigInteger, ForeignKey("sale.sale_id"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("product.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    sale = relationship("Sale", back_populates="sale_items")
    product = relationship("Product", back_populates="sale_items")
