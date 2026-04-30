from sqlalchemy.orm import Session
from app.models import Supplier

class SupplierService:
    """Service for supplier operations"""
    
    @staticmethod
    def get_all_suppliers(db: Session) -> list:
        """Get all suppliers"""
        return db.query(Supplier).all()
    
    @staticmethod
    def get_supplier_by_id(supplier_id: int, db: Session) -> Supplier:
        """Get a supplier by ID"""
        return db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    
    @staticmethod
    def get_supplier_by_name(name: str, db: Session) -> Supplier:
        """Get a supplier by name"""
        return db.query(Supplier).filter(Supplier.name == name).first()