from sqlalchemy.orm import Session
from app.models import Product, Inventory

class ProductService:
    """Service for product operations"""
    
    @staticmethod
    def _add_inventory_to_product(product: Product, db: Session) -> dict:
        """Helper method to add available quantity to product"""
        inventory = db.query(Inventory).filter(Inventory.product_id == product.product_id).first()
        quantity = inventory.quantity_on_hand if inventory else 0
        
        # Convert to dict and add available_quantity
        product_dict = {
            "product_id": product.product_id,
            "category_id": product.category_id,
            "barcode": product.barcode,
            "name": product.name,
            "description": product.description,
            "sku": product.sku,
            "unit_price": product.unit_price,
            "is_active": product.is_active,
            "available_quantity": quantity,
            "created_at": product.created_at,
            "updated_at": product.updated_at
        }
        return product_dict
    
    @staticmethod
    def get_all_products(db: Session) -> list:
        """Get all products with inventory quantities"""
        products = db.query(Product).all()
        return [ProductService._add_inventory_to_product(p, db) for p in products]
    
    @staticmethod
    def get_product_by_id(product_id: int, db: Session) -> dict:
        """Get a product by ID with inventory quantity"""
        product = db.query(Product).filter(Product.product_id == product_id).first()
        if not product:
            return None
        return ProductService._add_inventory_to_product(product, db)
    
    @staticmethod
    def get_products_by_category(category_id: int, db: Session) -> list:
        """Get all products in a category with inventory quantities"""
        products = db.query(Product).filter(Product.category_id == category_id).all()
        return [ProductService._add_inventory_to_product(p, db) for p in products]
    
    @staticmethod
    def create_product(product_data: dict, db: Session) -> Product:
        """Create a new product and automatically create inventory entry"""
        db_product = Product(**product_data)
        db.add(db_product)
        db.flush()  # Flush to get the product_id without committing
        
        # Automatically create inventory entry for the new product
        inventory = Inventory(
            product_id=db_product.product_id,
            quantity_on_hand=0,
            reorder_level=10,
            warehouse="Main"
        )
        db.add(inventory)
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
