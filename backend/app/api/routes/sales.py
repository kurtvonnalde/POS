from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Sale
from app.schemas.sale import SaleCreate, SaleUpdate, SaleResponse
from app.services.sales_service import SaleService
from app.database import SessionLocal
from datetime import datetime, timedelta

router = APIRouter(prefix="/sales", tags=["sales"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SaleResponse)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    """Create a new sale"""
    sale_items = [item.dict() for item in sale.sale_items]  # Convert Pydantic models to dicts
    sale_data = sale.dict(exclude={'sale_items'})
    return SaleService.create_sale(sale_data, sale_items, db)

@router.get("/", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    """Get all sales"""
    return SaleService.get_all_sales(db)

@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Get a sale by ID"""
    sale = SaleService.get_sale_by_id(sale_id, db)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.get("/date-range/stats")
def get_sales_by_date_range(start_date: str, end_date: str, db: Session = Depends(get_db)):
    """Get sales within a date range"""
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        sales = SaleService.get_sales_by_date_range(start, end, db)
        return {"sales": sales, "count": len(sales)}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

@router.get("/daily-stats/{date}")
def get_daily_sales(date: str, db: Session = Depends(get_db)):
    """Get daily sales total"""
    try:
        sale_date = datetime.fromisoformat(date)
        total = SaleService.get_daily_sales_total(sale_date, db)
        return {"date": date, "total": total}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

@router.get("/monthly-stats/{year}/{month}")
def get_monthly_sales(year: int, month: int, db: Session = Depends(get_db)):
    """Get monthly sales total"""
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Invalid month")
    total = SaleService.get_monthly_sales_total(year, month, db)
    return {"year": year, "month": month, "total": total}

@router.get("/analytics/top-products")
def get_top_products(limit: int = 10, db: Session = Depends(get_db)):
    """Get top selling products"""
    return SaleService.get_top_products(limit, db)

@router.patch("/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, sale_update: SaleUpdate, db: Session = Depends(get_db)):
    """Update sale status"""
    sale = SaleService.get_sale_by_id(sale_id, db)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    if sale_update.status:
        sale.status = sale_update.status
    db.commit()
    db.refresh(sale)
    return sale
