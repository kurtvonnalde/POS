from sqlalchemy.orm import Session
from docs.backend.app.models import Product

class ProductService:
    """Service for product operations"""
    
    @staticmethod
    def get_all_products(db: Session) -> list:
        """Get all products"""
        return db.query(Product).all()
    
    @staticmethod
    def get_product_by_id(product_id: int, db: Session) -> Product:
        """Get a product by ID"""
        return db.query(Product).filter(Product.product_id == product_id).first()
    
    @staticmethod
    def get_products_by_category(category_id: int, db: Session) -> list:
        """Get all products in a category"""
        return db.query(Product).filter(Product.category_id == category_id).all()
    
    @staticmethod
    def create_product(product_data: dict, db: Session) -> Product:
        """Create a new product"""
        db_product = Product(**product_data)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    
    @staticmethod
    def update_product(product_id: int, update_data: dict, db: Session) -> Product:
        """Update a product"""
        product = db.query(Product).filter(Product.product_id == product_id).first()
        if not product:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(product, key, value)
        
        db.commit()
        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(product_id: int, db: Session) -> bool:
        """Delete a product"""
        product = db.query(Product).filter(Product.product_id == product_id).first()
        if not product:
            return False
        
        db.delete(product)
        db.commit()
        return True
