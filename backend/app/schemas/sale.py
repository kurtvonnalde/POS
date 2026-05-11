from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    discount_amount: float = 0.0


class SaleItemResponse(BaseModel):
    sale_item_id: int
    sale_id: int
    product_id: int
    quantity: int
    unit_price: float
    discount_amount: float
    line_total: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SaleCreate(BaseModel):
    user_id: int
    discount_amount: float = 0.0
    tax_amount: float = 0.0
    sale_items: List[SaleItemCreate]


class SaleUpdate(BaseModel):
    status: Optional[str] = None


class SaleResponse(BaseModel):
    sale_id: int
    user_id: int
    sale_date: datetime
    subtotal: float
    discount_amount: float
    tax_amount: float
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
