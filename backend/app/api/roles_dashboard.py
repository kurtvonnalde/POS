from fastapi import APIRouter, Depends, HTTPException
from app.api.auth import get_current_user

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

@router.get("/auditor")
def auditor_dashboard(user=Depends(get_current_user)):
    if user["role"] != "auditor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Auditor!"}
