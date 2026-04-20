from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import jwt as pyjwt
from pydantic import BaseModel
from app import model as models, database
from app.utils import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "0000"
ALGORITHM = "HS256"

# === Schemas ===
class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    role: str

class UserLogin(BaseModel):
    username: str
    password: str

# === DB Dependency ===
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === Register ===
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = models.User(
        username=user.username,
        full_name=user.full_name,
        password_hash=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": new_user.username}

# === Login ===
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = pyjwt.encode({"sub": db_user.username, "role": db_user.role}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}
