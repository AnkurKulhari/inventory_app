import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. Fetch Render's URL, with your local URL as the backup
db_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:%40nkur111@localhost:5432/products"
)

# 2. Fix the Render "postgres://" prefix issue
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# 3. Create the engine and session using your exact variable names
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)