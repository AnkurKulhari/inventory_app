from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.testing.config import db_url

db_url = "postgresql://postgres:%40nkur111@localhost:5432/products"
engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)