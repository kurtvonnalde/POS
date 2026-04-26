from sqlalchemy.orm import Session
from app.models import User

class UserService:
    """Service for user operations"""
    
    @staticmethod
    def get_all_users(db: Session) -> list:
        """Get all users"""
        return db.query(User).all()
    
    @staticmethod
    def get_user_by_username(username: str, db: Session) -> User:
        """Get a user by username"""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_user_by_id(user_id: int, db: Session) -> User:
        """Get a user by ID"""
        return db.query(User).filter(User.user_id == user_id).first()
