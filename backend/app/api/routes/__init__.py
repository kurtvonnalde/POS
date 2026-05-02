# API Routes __init__.py
from .auth import router as auth_router
from .users import router as users_router
from .dashboard import router as dashboard_router
from .suppliers import router as suppliers_router
from .category import router as category_router

__all__ = ["auth_router", "users_router", "dashboard_router", "suppliers_router", "category_router"]
