from sqlalchemy.orm import Session
from app.models import Inventory, Product

class InventoryService:
    """Service for inventory operations"""
    
    @staticmethod
    def get_all_inventory(db: Session) -> list:
        """Get all inventory records"""
        return db.query(Inventory).all()
    
    @staticmethod
    def get_inventory_by_id(inventory_id: int, db: Session) -> Inventory:
        """Get inventory by ID"""
        return db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
    
    @staticmethod
    def get_inventory_by_product(product_id: int, db: Session) -> Inventory:
        """Get inventory by product ID"""
        return db.query(Inventory).filter(Inventory.product_id == product_id).first()
    
    @staticmethod
    def get_low_stock_items(db: Session) -> list:
        """Get items with stock below reorder level"""
        return db.query(Inventory).filter(
            Inventory.quantity_on_hand <= Inventory.reorder_level
        ).all()
    
    @staticmethod
    def create_inventory(inventory_data: dict, db: Session) -> Inventory:
        """Create a new inventory record"""
        db_inventory = Inventory(**inventory_data)
        db.add(db_inventory)
        db.commit()
        db.refresh(db_inventory)
        return db_inventory
    
    @staticmethod
    def update_inventory(inventory_id: int, update_data: dict, db: Session) -> Inventory:
        """Update inventory record"""
        inventory = db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
        if not inventory:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(inventory, key, value)
        
        db.commit()
        db.refresh(inventory)
        return inventory
    
    @staticmethod
    def update_quantity(product_id: int, quantity_change: int, db: Session) -> Inventory:
        """Update product quantity"""
        inventory = db.query(Inventory).filter(Inventory.product_id == product_id).first()
        if not inventory:
            return None
        
        inventory.quantity_on_hand += quantity_change
        db.commit()
        db.refresh(inventory)
        return inventory
