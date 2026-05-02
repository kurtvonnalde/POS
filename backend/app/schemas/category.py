from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str]

class CategoryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]

class CategoryResponse(BaseModel):
    category_id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True
