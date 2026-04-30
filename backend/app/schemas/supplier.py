from pydantic import BaseModel
from typing import Optional

class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str]
    phone: str
    email: Optional[str]


class SupplierUpdate(BaseModel):
    name: Optional[str]
    contact_person: Optional[str]
    phone: str
    email: Optional[str]

class SupplierResponse(BaseModel):
    supplier_id: int
    name: str
    contact_person: Optional[str]
    phone: str
    email: Optional[str]

    class Config:
        from_attributes = True