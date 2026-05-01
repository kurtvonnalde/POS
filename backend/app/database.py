from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .base import Base

# 1. Define your database URL (PostgreSQL example)
# Make sure the database 'pos_db' exists. If not, create it in pgAdmin or with:
# CREATE DATABASE pos_db;
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:myq36N&N99MsO@localhost:5433/pos_db"

# 2. Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)

# 3. Create a configured "SessionLocal" class
# Each instance will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. (Optional) Create all tables (run once at startup)
# Tables are created in main.py after importing all models
# Base.metadata.create_all(bind=engine)