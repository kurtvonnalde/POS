from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate
from app.database import SessionLocal

router = APIRouter(prefix="/supplier", tags=["suppliers"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.get("/")
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(Supplier).all()

@router.delete("/{supplier_id}")
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if supplier:
        db.delete(supplier)
        db.commit()
        return {"message": "Supplier deleted successfully"}
    return {"message": "Supplier not found"}

@router.patch("/{supplier_id}")
def update_supplier(supplier_id: int, name: str = None, contact_person: str = None, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        return {"message": "Supplier not found"}
    
    if name:
        supplier.name = name
    if contact_person:
        supplier.contact_person = contact_person
    
    db.commit()
    db.refresh(supplier)
    return supplier