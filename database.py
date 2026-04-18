from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SERVER_NAME = "DESKTOP-KK4GK3V" 
DATABASE_NAME = "DA" 

SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc://@{SERVER_NAME}/{DATABASE_NAME}?driver=SQL+Server&Trusted_Connection=yes"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()