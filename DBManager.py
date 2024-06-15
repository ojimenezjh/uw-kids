import os
import dotenv
import json

from pymongo import MongoClient

class DBManager:
    def __init__(self):
        
        dotenv.load_dotenv()
        
        host = os.getenv('DB_HOST')
        port = os.getenv('DB_PORT')
        database_name = os.getenv('DB_NAME')
        collection_name = os.getenv('DB_COLLECTION')
        username = os.getenv('DB_USER')
        password = os.getenv('DB_PASS')
        
        connection_string = f"mongodb://{username}:{password}@{host}:{port}/{database_name}"
        self.client = MongoClient(connection_string)
        self.db = self.client[database_name]
        self.collection = self.db[collection_name]

    def insert(self, valor):
        try:
            self.collection.insert_one(json.loads(valor))
        except:
            raise Exception("[ERROR] Cannot insert into the database!!")
