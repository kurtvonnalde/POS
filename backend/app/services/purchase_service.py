from sqlalchemy.orm import Session
from app.models import Purchase, PurchaseItem, Inventory
from sqlalchemy import func

class PurchaseService:
    """Service for purchase operations"""
    
    @staticmethod
    def get_all_purchases(db: Session) -> list:
        """Get all purchases"""
        return db.query(Purchase).all()
    
    @staticmethod
    def get_purchase_by_id(purchase_id: int, db: Session) -> Purchase:
        """Get a purchase by ID"""
        return db.query(Purchase).filter(Purchase.purchase_id == purchase_id).first()
    
    @staticmethod
    def get_purchases_by_supplier(supplier_id: int, db: Session) -> list:
        """Get all purchases from a supplier"""
        return db.query(Purchase).filter(Purchase.supplier_id == supplier_id).all()
    
    @staticmethod
    def create_purchase(purchase_data: dict, purchase_items: list, db: Session) -> Purchase:
        """Create a new purchase with items"""
        total_cost = 0.0
        
        # Calculate total cost
        for item in purchase_items:
            total_cost += item['quantity'] * item['unit_cost']
        
        purchase_data['total_cost'] = total_cost
        
        db_purchase = Purchase(**{k: v for k, v in purchase_data.items() if k != 'purchase_items'})
        db.add(db_purchase)
        db.flush()
        
        # Add purchase items
        for item in purchase_items:
            item['purchase_id'] = db_purchase.purchase_id
            db_purchase_item = PurchaseItem(**item)
            db.add(db_purchase_item)
            
            # Update inventory
            inventory = db.query(Inventory).filter(Inventory.product_id == item['product_id']).first()
            if inventory:
                inventory.quantity_on_hand += item['quantity']
            else:
                # Create new inventory record if not exists
                new_inventory = Inventory(
                    product_id=item['product_id'],
                    quantity_on_hand=item['quantity'],
                    reorder_level=10,
                    warehouse="Main"
                )
                db.add(new_inventory)
        
        db.commit()
        db.refresh(db_purchase)
        return db_purchase
    
    @staticmethod
    def update_purchase_status(purchase_id: int, status: str, db: Session) -> Purchase:
        """Update purchase status"""
        purchase = db.query(Purchase).filter(Purchase.purchase_id == purchase_id).first()
        if not purchase:
            return None
        
        purchase.status = status
        db.commit()
        db.refresh(purchase)
        return purchase
    
    @staticmethod
    def get_pending_purchases(db: Session) -> list:
        """Get all pending purchases"""
        return db.query(Purchase).filter(Purchase.status == 'pending').all()
