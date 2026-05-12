from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PaymentCreate(BaseModel):
    sale_id: int
    payment_method: str
    amount: float
    reference_no: Optional[str] = None
    currency: str = "USD"
    cash_amount: Optional[float] = None
    change_amount: Optional[float] = None


class PaymentUpdate(BaseModel):
    payment_method: Optional[str] = None
    amount: Optional[float] = None
    reference_no: Optional[str] = None
    cash_amount: Optional[float] = None
    change_amount: Optional[float] = None


class PaymentResponse(BaseModel):
    payment_id: int
    sale_id: int
    payment_method: str
    amount: float
    reference_no: Optional[str] = None
    payment_date: datetime
    currency: str
    cash_amount: Optional[float] = None
    change_amount: Optional[float] = None

    class Config:
        from_attributes = True
