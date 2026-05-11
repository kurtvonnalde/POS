from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    sale_id: int
    payment_method: str
    amount: float
    reference_no: Optional[str] = None
    currency: str = "USD"


class PaymentUpdate(BaseModel):
    payment_method: Optional[str] = None
    amount: Optional[float] = None
    reference_no: Optional[str] = None


class PaymentResponse(BaseModel):
    payment_id: int
    sale_id: int
    payment_method: str
    amount: float
    reference_no: Optional[str] = None
    payment_date: datetime
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True
