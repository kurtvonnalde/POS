from fastapi import APIRouter, Depends, HTTPException
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
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted successfully"}

@router.patch("/{supplier_id}")
def update_supplier(supplier_id: int, supplier_update: SupplierUpdate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.supplier_id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    if supplier_update.name is not None:
        supplier.name = supplier_update.name
    if supplier_update.contact_person is not None:
        supplier.contact_person = supplier_update.contact_person
    if supplier_update.email is not None:
        supplier.email = supplier_update.email
    if supplier_update.phone is not None:
        supplier.phone = supplier_update.phone

    db.commit()
    db.refresh(supplier)
    return supplier