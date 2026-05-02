from sqlalchemy.orm import Session
from app.models import Category

class CategoryService:
    """Service for category operations"""
    
    @staticmethod
    def get_all_categories(db: Session) -> list:
        """Get all categories"""
        return db.query(Category).all()
    
    @staticmethod
    def get_category_by_id(category_id: int, db: Session) -> Category:
        """Get a category by ID"""
        return db.query(Category).filter(Category.category_id == category_id).first()
    
    @staticmethod
    def get_category_by_name(name: str, db: Session) -> Category:
        """Get a category by name"""
        return db.query(Category).filter(Category.name == name).first()