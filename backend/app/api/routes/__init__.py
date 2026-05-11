# API Routes __init__.py
from .auth import router as auth_router
from .users import router as users_router
from .dashboard import router as dashboard_router
from .suppliers import router as suppliers_router
from .category import router as category_router
from .products import router as products_router
from .inventory import router as inventory_router
from .sales import router as sales_router
from .purchases import router as purchases_router
from .purchase import router as purchase_router

__all__ = [
    "auth_router", "users_router", "dashboard_router", "suppliers_router", "category_router",
    "products_router", "inventory_router", "sales_router", "purchases_router", "purchase_router"
]
