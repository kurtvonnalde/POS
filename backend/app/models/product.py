from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, BigInteger, Boolean, func, Text
from sqlalchemy.orm import relationship
from app.base import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "product"
    product_id = Column(BigInteger, primary_key=True)
    category_id = Column(BigInteger, ForeignKey("category.category_id"), nullable=False)
    barcode = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    sku = Column(String, unique=True, nullable=False)
    unit_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    category = relationship("Category", back_populates="products")
    inventory = relationship("Inventory", back_populates="product", cascade="all, delete-orphan")
    sale_items = relationship("SaleItem", back_populates="product")
    purchase_items = relationship("PurchaseItem", back_populates="product")
