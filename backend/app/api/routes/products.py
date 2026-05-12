from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import Product, Inventory
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService
from app.database import SessionLocal

router = APIRouter(prefix="/products", tags=["products"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    return ProductService.create_product(product.dict(), db)

@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """Get all products"""
    return ProductService.get_all_products(db)

@router.get("/barcode/{barcode}", response_model=dict)
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    """Get a product by barcode for POS scanning"""
    product = db.query(Product).filter(Product.barcode == barcode).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Add inventory quantity to response
    inventory = db.query(Inventory).filter(Inventory.product_id == product.product_id).first()
    response = {
        "product_id": product.product_id,
        "category_id": product.category_id,
        "barcode": product.barcode,
        "name": product.name,
        "description": product.description,
        "sku": product.sku,
        "unit_price": product.unit_price,
        "is_active": product.is_active,
        "available_quantity": inventory.quantity_on_hand if inventory else 0,
        "created_at": product.created_at,
        "updated_at": product.updated_at
    }
    return response

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a product by ID"""
    product = ProductService.get_product_by_id(product_id, db)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/category/{category_id}", response_model=list[ProductResponse])
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    """Get all products in a category"""
    return ProductService.get_products_by_category(category_id, db)

@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    """Update a product"""
    product = ProductService.update_product(product_id, product_update.dict(exclude_unset=True), db)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product"""
    success = ProductService.delete_product(product_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
    success = ProductService.delete_product(product_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}
