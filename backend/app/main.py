from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth_router, users_router, dashboard_router, suppliers_router
from app.models import User, Role, Supplier  # Import all models for table creation
from app.database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS with environment variables
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(dashboard_router)
app.include_router(suppliers_router)

@app.get("/health")
def health():
    return {"status": "ok"}