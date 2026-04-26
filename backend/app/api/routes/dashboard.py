from fastapi import APIRouter, Depends, HTTPException
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/dashboards", tags=["dashboards"])

@router.get("/admin")
def admin_dashboard(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Admin!"}

@router.get("/cashier")
def cashier_dashboard(user=Depends(get_current_user)):
    if user["role"] != "cashier":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Cashier!"}

@router.get("/viewer")
def viewer_dashboard(user=Depends(get_current_user)):
    if user["role"] != "viewer":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Viewer!"}
