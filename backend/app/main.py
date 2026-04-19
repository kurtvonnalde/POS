
# === Standard Library Imports ===
import jwt

# === Third-Party Imports ===
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel

# === Local Imports ===
from . import model as models
from . import database
from app.utils import hash_password, verify_password

app = FastAPI()

# === CORS Settings (MUST be right after app init) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Pydantic Schemas ===
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str



# === JWT Settings ===
SECRET_KEY = "0000"
ALGORITHM = "HS256"

# === Security Dependency ===
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Decode JWT token from Authorization header and return payload."""
    token = credentials.credentials
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

# Dependency to get DB session

# === Database Dependency ===
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# === API Endpoints ===
@app.post("/users")
def create_user(name: str, role: str, email: str, db: Session = Depends(get_db)):
    """Create a user (for testing/demo)."""
    user = models.User(username=name, role=role, email=email, hashed_password="")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    """Get all users."""
    return db.query(models.User).all()



@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": new_user.username}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({"sub": user.username, "role": user.role}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


# === Role-Based Dashboards ===
@app.get("/admin-dashboard")
def admin_dashboard(user=Depends(get_current_user)):
    """Admin dashboard endpoint."""
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Admin!"}

@app.get("/cashier-dashboard")
def cashier_dashboard(user=Depends(get_current_user)):
    """Cashier dashboard endpoint."""
    if user["role"] != "cashier":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Cashier!"}

@app.get("/auditor-dashboard")
def auditor_dashboard(user=Depends(get_current_user)):
    """Auditor dashboard endpoint."""
    if user["role"] != "auditor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return {"message": "Welcome Auditor!"}
