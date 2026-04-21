import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# Lấy URL từ .env nếu có, hoặc dùng cấu hình mặc định (fallback)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "mssql+pyodbc://DESKTOP-KK4GK3V/DA?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()