from sqlalchemy.orm import Session
from docs.backend.app.models import Payment, Sale

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
        """Create a new payment"""
        db_payment = Payment(**payment_data)
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    
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
