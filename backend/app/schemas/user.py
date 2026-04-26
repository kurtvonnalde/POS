from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str]
    role: str

    class Config:
        from_attributes = True
