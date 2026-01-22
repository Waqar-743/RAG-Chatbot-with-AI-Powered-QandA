
import asyncio
import os
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import settings
from config.constants import DOCUMENTS_COLLECTION, CHAT_HISTORY_COLLECTION, METADATA_COLLECTION
from qdrant_client import QdrantClient
from qdrant_client.models import FilterSelector, Filter
from pymongo import MongoClient

async def clear_all_data():
    print("🧹 Starting data cleanup...")
    
    # 1. Clear MongoDB Collections
    try:
        print(f"Connecting to MongoDB: {settings.mongo_db_name}...")
        mongo_client = MongoClient(settings.mongo_uri)
        db = mongo_client[settings.mongo_db_name]
        
        # Clear collections
        result_docs = db[DOCUMENTS_COLLECTION].delete_many({})
        result_history = db[CHAT_HISTORY_COLLECTION].delete_many({})
        result_meta = db[METADATA_COLLECTION].delete_many({})
        
        print(f"✅ MongoDB: Deleted {result_docs.deleted_count} documents")
        print(f"✅ MongoDB: Deleted {result_history.deleted_count} history entries")
        print(f"✅ MongoDB: Deleted {result_meta.deleted_count} metadata entries")
        
        mongo_client.close()
    except Exception as e:
        print(f"❌ Error clearing MongoDB: {e}")

    # 2. Clear Qdrant Collection
    try:
        print(f"Connecting to Qdrant: {settings.qdrant_url}...")
        qdrant_client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key
        )
        
        # Delete all points from the collection
        qdrant_client.delete(
            collection_name=settings.qdrant_collection,
            points_selector=FilterSelector(
                filter=Filter() # Empty filter = matches all
            )
        )
        print(f"✅ Qdrant: Cleared collection '{settings.qdrant_collection}'")
        
        qdrant_client.close()
    except Exception as e:
        print(f"❌ Error clearing Qdrant: {e}")

    print("✨ Cleanup complete!")

if __name__ == "__main__":
    asyncio.run(clear_all_data())
