from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
print("Connected:", client.list_database_names())