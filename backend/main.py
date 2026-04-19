from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["pos_db"]

@app.get("/")
def root():
    return {"message": "Welcome to the POS system!"}

@app.get("/products")
def get_products():
    products = list(db.products.find({}, {"_id": 0}))
    return {"products": products}

@app.post("/products")
def add_product(product: dict):
    db.products.insert_one(product)
    return {"message": "Product added successfully!"}