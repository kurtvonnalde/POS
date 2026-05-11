from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PurchaseItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_cost: float


class PurchaseItemResponse(BaseModel):
    purchase_item_id: int
    purchase_id: int
    product_id: int
    quantity: int
    unit_cost: float
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseCreate(BaseModel):
    supplier_id: int
    user_id: int
    purchase_items: List[PurchaseItemCreate]


class PurchaseUpdate(BaseModel):
    status: Optional[str] = None


class PurchaseResponse(BaseModel):
    purchase_id: int
    supplier_id: int
    user_id: int
    total_cost: float
    created_at: datetime
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True
