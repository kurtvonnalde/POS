from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    category_id: int
    barcode: str
    name: str
    description: Optional[str] = None
    sku: str
    unit_price: float
    is_active: bool = True


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    barcode: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    unit_price: Optional[float] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    product_id: int
    category_id: int
    barcode: str
    name: str
    description: Optional[str] = None
    sku: str
    unit_price: float
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
