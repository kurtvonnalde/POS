from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import model as models, database

router = APIRouter(prefix="/users", tags=["users"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_user(name: str, role: str, email: str, db: Session = Depends(get_db)):
    user = models.User(username=name, role=role, email=email, hashed_password="")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()
