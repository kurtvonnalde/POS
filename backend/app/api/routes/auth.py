from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import jwt as pyjwt
from app.schemas import UserCreate, UserLogin
from app.database import SessionLocal
from app.services import AuthService
from app.exceptions import UserAlreadyExists, InvalidCredentials, TokenInvalid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

# === DB Dependency ===
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === Register ===
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = AuthService.register_user(user, db)
        return {"message": "User registered successfully", "user": new_user.username}
    except UserAlreadyExists as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

# === Login ===
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = AuthService.authenticate_user(user.username, user.password, db)
        token = pyjwt.encode(
    {
        "sub": db_user.username,
        "role": db_user.role.name  # ✅ use the role name string
    },
    SECRET_KEY,
    algorithm=ALGORITHM
)
        return {
            "access_token": token,
            "token_type": "bearer",
            "username": db_user.username,
            "role_name": db_user.role.name
        }
    except InvalidCredentials as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

# === Token Verification ===
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify and decode JWT token"""
    try:
        token = credentials.credentials
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise TokenInvalid()
        return payload
    except pyjwt.InvalidTokenError:
        raise TokenInvalid()

@router.get("/verify")
def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify if the provided token is valid"""
    return {
        "valid": True,
        "username": current_user.get("sub"),
        "user_id": current_user.get("user_id"),
        "role_id": current_user.get("role_id")
    }
