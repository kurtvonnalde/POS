from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventoryCreate(BaseModel):
    product_id: int
    quantity_on_hand: int
    reorder_level: int
    warehouse: str


class InventoryUpdate(BaseModel):
    quantity_on_hand: Optional[int] = None
    reorder_level: Optional[int] = None
    warehouse: Optional[str] = None


class InventoryResponse(BaseModel):
    inventory_id: int
    product_id: int
    quantity_on_hand: int
    reorder_level: int
    warehouse: str
    updated_at: datetime

    class Config:
        from_attributes = True
