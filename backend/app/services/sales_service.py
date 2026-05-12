from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Sale, SaleItem, Payment, Inventory
from datetime import datetime, timedelta

class SaleService:
    """Service for sales operations"""
    
    @staticmethod
    def get_all_sales(db: Session) -> list:
        """Get all sales"""
        return db.query(Sale).all()
    
    @staticmethod
    def get_sale_by_id(sale_id: int, db: Session) -> Sale:
        """Get a sale by ID"""
        return db.query(Sale).filter(Sale.sale_id == sale_id).first()
    
    @staticmethod
    def get_sales_by_date_range(start_date: datetime, end_date: datetime, db: Session) -> list:
        """Get sales within a date range"""
        return db.query(Sale).filter(
            Sale.sale_date.between(start_date, end_date)
        ).all()
    
    @staticmethod
    def create_sale(sale_data: dict, sale_items: list, db: Session) -> Sale:
        """Create a new sale with items - DO NOT update inventory yet"""
        subtotal = 0.0
        
        # Calculate subtotal
        for item in sale_items:
            subtotal += item['quantity'] * item['unit_price']
        
        sale_data['subtotal'] = subtotal
        sale_data['total_amount'] = subtotal - sale_data.get('discount_amount', 0) + sale_data.get('tax_amount', 0)
        
        db_sale = Sale(**{k: v for k, v in sale_data.items() if k != 'sale_items'})
        db.add(db_sale)
        db.flush()
        
        # Add sale items - BUT DO NOT update inventory yet
        for item in sale_items:
            item['sale_id'] = db_sale.sale_id
            item['line_total'] = item['quantity'] * item['unit_price'] - item.get('discount_amount', 0)
            db_sale_item = SaleItem(**item)
            db.add(db_sale_item)
        
        db.commit()
        db.refresh(db_sale)
        return db_sale
    
    @staticmethod
    def get_daily_sales_total(date: datetime, db: Session) -> float:
        """Get total sales for a day"""
        result = db.query(func.sum(Sale.total_amount)).filter(
            func.date(Sale.sale_date) == date.date()
        ).scalar()
        return result or 0.0
    
    @staticmethod
    def get_monthly_sales_total(year: int, month: int, db: Session) -> float:
        """Get total sales for a month"""
        result = db.query(func.sum(Sale.total_amount)).filter(
            func.extract('year', Sale.sale_date) == year,
            func.extract('month', Sale.sale_date) == month
        ).scalar()
        return result or 0.0
    
    @staticmethod
    def get_top_products(limit: int = 10, db: Session = None) -> list:
        """Get top selling products"""
        from sqlalchemy import func
        result = db.query(
            SaleItem.product_id,
            func.sum(SaleItem.quantity).label('total_quantity'),
            func.sum(SaleItem.line_total).label('total_revenue')
        ).group_by(SaleItem.product_id).order_by(
            func.sum(SaleItem.line_total).desc()
        ).limit(limit).all()
        return result
