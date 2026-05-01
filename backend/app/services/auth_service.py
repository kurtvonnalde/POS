from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from app.utils import hash_password, verify_password
from app.exceptions import UserAlreadyExists, InvalidCredentials

class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    def register_user(user: UserCreate, db: Session) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.username == user.username) | (User.email == user.email)
        ).first()
        if existing_user:
            raise UserAlreadyExists()
        
        # Create new user
        new_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            password_hash=hash_password(user.password),
            role_id=user.role_id
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    
    @staticmethod
    def authenticate_user(username: str, password: str, db: Session) -> User:
        """Authenticate a user"""
        db_user = db.query(User).filter(User.username == username).first()
        if not db_user or not verify_password(password, db_user.password_hash):
            raise InvalidCredentials()
        return db_user
