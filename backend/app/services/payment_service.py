from sqlalchemy.orm import Session
from app.models import Payment, Sale, SaleItem, Inventory

class PaymentService:
    """Service for payment operations"""
    
    @staticmethod
    def get_all_payments(db: Session) -> list:
        """Get all payments"""
        return db.query(Payment).all()
    
    @staticmethod
    def get_payment_by_id(payment_id: int, db: Session) -> Payment:
        """Get a payment by ID"""
        return db.query(Payment).filter(Payment.payment_id == payment_id).first()
    
    @staticmethod
    def get_payments_by_sale(sale_id: int, db: Session) -> list:
        """Get payments for a sale"""
        return db.query(Payment).filter(Payment.sale_id == sale_id).all()
    
    @staticmethod
    def create_payment(payment_data: dict, db: Session) -> Payment:
        """Create a new payment and update inventory only when payment is confirmed"""
        try:
            # Create payment
            db_payment = Payment(**payment_data)
            db.add(db_payment)
            db.flush()  # Get payment_id without committing
            
            # Get the sale and its items to decrement inventory
            sale_id = payment_data['sale_id']
            sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
            if sale:
                sale_items = db.query(SaleItem).filter(SaleItem.sale_id == sale_id).all()
                
                # Decrement inventory for each item - ONLY when payment is created
                for sale_item in sale_items:
                    inventory = db.query(Inventory).filter(
                        Inventory.product_id == sale_item.product_id
                    ).first()
                    if inventory:
                        inventory.quantity_on_hand -= sale_item.quantity
            
            # Commit both payment creation and inventory update together
            db.commit()
            db.refresh(db_payment)
            return db_payment
        except Exception as e:
            # Rollback on any error - nothing is saved
            db.rollback()
            raise e
    
    @staticmethod
    def update_payment(payment_id: int, update_data: dict, db: Session) -> Payment:
        """Update a payment"""
        payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
        if not payment:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(payment, key, value)
        
        db.commit()
        db.refresh(payment)
        return payment
    
    @staticmethod
    def delete_payment(payment_id: int, db: Session) -> bool:
        """Delete a payment"""
        payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
        if not payment:
            return False
        
        db.delete(payment)
        db.commit()
        return True
