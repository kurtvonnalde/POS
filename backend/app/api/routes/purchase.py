from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Purchase
from app.schemas.purchase import PurchaseCreate, PurchaseUpdate, PurchaseResponse
from app.services.purchase_service import PurchaseService
from app.database import SessionLocal

router = APIRouter(prefix="/purchases", tags=["purchases"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PurchaseResponse)
def create_purchase(purchase: PurchaseCreate, db: Session = Depends(get_db)):
    """Create a new purchase"""
    purchase_items = purchase.purchase_items
    purchase_data = purchase.dict(exclude={'purchase_items'})
    return PurchaseService.create_purchase(purchase_data, purchase_items, db)

@router.get("/", response_model=list[PurchaseResponse])
def get_purchases(db: Session = Depends(get_db)):
    """Get all purchases"""
    return PurchaseService.get_all_purchases(db)

@router.get("/{purchase_id}", response_model=PurchaseResponse)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    """Get a purchase by ID"""
    purchase = PurchaseService.get_purchase_by_id(purchase_id, db)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase

@router.get("/supplier/{supplier_id}", response_model=list[PurchaseResponse])
def get_supplier_purchases(supplier_id: int, db: Session = Depends(get_db)):
    """Get all purchases from a supplier"""
    return PurchaseService.get_purchases_by_supplier(supplier_id, db)

@router.get("/status/pending", response_model=list[PurchaseResponse])
def get_pending_purchases(db: Session = Depends(get_db)):
    """Get all pending purchases"""
    return PurchaseService.get_pending_purchases(db)

@router.patch("/{purchase_id}", response_model=PurchaseResponse)
def update_purchase(purchase_id: int, purchase_update: PurchaseUpdate, db: Session = Depends(get_db)):
    """Update purchase status"""
    if not purchase_update.status:
        raise HTTPException(status_code=400, detail="Status is required")
    purchase = PurchaseService.update_purchase_status(purchase_id, purchase_update.status, db)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase
