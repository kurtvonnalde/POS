from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import User
from app.database import SessionLocal

router = APIRouter(prefix="/app_user", tags=["users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_user(username: str, full_name: str, role: str, db: Session = Depends(get_db)):
    user = User(username=username, full_name=full_name, role=role, password_hash="")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    return {"message": "User not found"}

@router.patch("/{user_id}")
def update_user(user_id: int, username: str = None, full_name: str = None, role: str = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return {"message": "User not found"}
    
    if username:
        user.username = username
    if full_name:
        user.full_name = full_name
    if role:
        user.role = role
    
    db.commit()
    db.refresh(user)
    return user;