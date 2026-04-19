from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
print("Connected:", client.list_database_names())

db = client["db_pos"]

# Create or access the collection
products_collection = db["products"]

# Insert a sample product
products_collection.insert_one({
    "name": "Laptop",
    "price": 1200,
    "stock": 10
})