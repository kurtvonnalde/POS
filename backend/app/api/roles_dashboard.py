from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

router = APIRouter(prefix="/dashboards", tags=["dashboards"])

SECRET_KEY = "0000"
ALGORITHM = "HS256"
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

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
