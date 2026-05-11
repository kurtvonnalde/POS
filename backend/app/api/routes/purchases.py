from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from docs.backend.app.models import Payment
from docs.backend.app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse
from docs.backend.app.services.payment_service import PaymentService
from docs.backend.app.database import SessionLocal

router = APIRouter(prefix="/payments", tags=["payments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    """Create a new payment"""
    return PaymentService.create_payment(payment.dict(), db)

@router.get("/", response_model=list[PaymentResponse])
def get_payments(db: Session = Depends(get_db)):
    """Get all payments"""
    return PaymentService.get_all_payments(db)

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get a payment by ID"""
    payment = PaymentService.get_payment_by_id(payment_id, db)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.get("/sale/{sale_id}", response_model=list[PaymentResponse])
def get_sale_payments(sale_id: int, db: Session = Depends(get_db)):
    """Get all payments for a sale"""
    return PaymentService.get_payments_by_sale(sale_id, db)

@router.patch("/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, payment_update: PaymentUpdate, db: Session = Depends(get_db)):
    """Update a payment"""
    payment = PaymentService.update_payment(payment_id, payment_update.dict(exclude_unset=True), db)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.delete("/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    """Delete a payment"""
    success = PaymentService.delete_payment(payment_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted successfully"}
