from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate, InventoryResponse
from app.services.inventory_service import InventoryService
from app.database import SessionLocal

router = APIRouter(prefix="/inventory", tags=["inventory"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=InventoryResponse)
def create_inventory(inventory: InventoryCreate, db: Session = Depends(get_db)):
    """Create a new inventory record"""
    return InventoryService.create_inventory(inventory.dict(), db)

@router.get("/", response_model=list[InventoryResponse])
def get_inventory(db: Session = Depends(get_db)):
    """Get all inventory records"""
    return InventoryService.get_all_inventory(db)

@router.get("/low-stock", response_model=list[InventoryResponse])
def get_low_stock(db: Session = Depends(get_db)):
    """Get items with low stock"""
    return InventoryService.get_low_stock_items(db)

@router.get("/product/{product_id}", response_model=InventoryResponse)
def get_product_inventory(product_id: int, db: Session = Depends(get_db)):
    """Get inventory by product ID"""
    inventory = InventoryService.get_inventory_by_product(product_id, db)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found for this product")
    return inventory

@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory_item(inventory_id: int, db: Session = Depends(get_db)):
    """Get an inventory record by ID"""
    inventory = InventoryService.get_inventory_by_id(inventory_id, db)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@router.patch("/{inventory_id}", response_model=InventoryResponse)
def update_inventory(inventory_id: int, inventory_update: InventoryUpdate, db: Session = Depends(get_db)):
    """Update an inventory record"""
    inventory = InventoryService.update_inventory(inventory_id, inventory_update.dict(exclude_unset=True), db)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory
