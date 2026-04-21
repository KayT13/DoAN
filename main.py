from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, NVARCHAR, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
import bcrypt 
import jwt
from datetime import datetime, timedelta, timezone

# ═══════════════════════════════════════
#   CẤU HÌNH DATABASE (Đã gộp vào main.py)
# ═══════════════════════════════════════
# LƯU Ý: Nhớ đổi 'sa', 'matkhau', 'TenDB' thành thông tin máy bạn
SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://DESKTOP-KK4GK3V/DA?driver=ODBC+Driver+17+for+SQL+Server&Trusted_Connection=yes"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ═══════════════════════════════════════
#   PYDANTIC SCHEMAS (KHUÔN MẪU DỮ LIỆU)
# ═══════════════════════════════════════
class UserLogin(BaseModel):
    tenDangNhap: str
    matKhau: str

class TienDoHocRequest(BaseModel):
    maNguoiDung: int
    maBaiHoc: int

class NguoiDungDangKy(BaseModel):
    tenDangNhap: str
    matKhau: str
    hoTen: str
    email: str

# ═══════════════════════════════════════
#   SQLALCHEMY MODELS (ĐỊNH NGHĨA BẢNG)
# ═══════════════════════════════════════
class TienDoHoc(Base):
    __tablename__ = "TienDoHoc"

    maNguoiDung = Column(Integer, primary_key=True)
    maBaiHoc = Column(Integer, primary_key=True)
    daHoanThanh = Column(Boolean, default=False)
    thoiGianHoanThanh = Column(DateTime)

class KhoaHoc(Base):
    __tablename__ = "KhoaHoc"

    maKhoaHoc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenKhoaHoc = Column(NVARCHAR(255))
    # Dùng Text để không bị lỗi "Invalid precision value (0)" trên SQL Server
    moTa = Column(Text) 
    trinhDo = Column(NVARCHAR(50))

class BaiHoc(Base):
    __tablename__ = "BaiHoc"

    maBaiHoc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    maKhoaHoc = Column(Integer) # Khóa ngoại liên kết với Khóa học
    tenBaiHoc = Column(NVARCHAR(255))
    noiDung = Column(Text)
    thuTu = Column(Integer)

class NguoiDung(Base):
    __tablename__ = "NguoiDung"

    maNguoiDung = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenDangNhap = Column(String(50))
    matKhau = Column(String(255))
    email = Column(String(100))
    hoTen = Column(NVARCHAR(100))

# ═══════════════════════════════════════
#  TẠO BẢNG TRONG DATABASE
# ═══════════════════════════════════════
Base.metadata.create_all(bind=engine)

# ═══════════════════════════════════════
#   APP CONFIG & MIDDLEWARE
# ═══════════════════════════════════════
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cấp quyền cho mọi Frontend
    allow_credentials=True,
    allow_methods=["*"], # Cho phép mọi phương thức GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# ═══════════════════════════════════════
#   HELPER FUNCTIONS (BĂM MẬT KHẨU & JWT)
# ═══════════════════════════════════════
SECRET_KEY = "Hệ_Thống_Elearning_Của_Tôi_Mật_Khẩu_Siêu_Cấp_Vũ_Trụ"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 giờ

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ═══════════════════════════════════════
#   API ENDPOINTS
# ═══════════════════════════════════════

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(KhoaHoc).all()
    # Chuyển đổi dữ liệu để trả về dạng dict cho Frontend dễ đọc
    result = []
    for c in courses:
        result.append({
            "maKhoaHoc": c.maKhoaHoc,
            "tenKhoaHoc": c.tenKhoaHoc,
            "moTa": c.moTa,
            "trinhDo": c.trinhDo
        })
    return {"status": "success", "data": result}

@app.get("/api/courses/{course_id}/lessons")
def get_lessons_by_course(course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(BaiHoc).filter(BaiHoc.maKhoaHoc == course_id).order_by(BaiHoc.thuTu).all()
    return {"status": "success", "course_id": course_id, "data": lessons}

@app.post("/api/users/register")
def register_user(user: NguoiDungDangKy, db: Session = Depends(get_db)):
    db_user = db.query(NguoiDung).filter(NguoiDung.tenDangNhap == user.tenDangNhap).first()
    if db_user:
        return {"status": "error", "message": "Tên đăng nhập đã tồn tại!"}
        
    hashed_password = get_password_hash(user.matKhau)
    
    new_user = NguoiDung(
        tenDangNhap=user.tenDangNhap,
        matKhau=hashed_password, 
        hoTen=user.hoTen,
        email=user.email
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": "success", "message": "Đăng ký thành công!", "user_id": new_user.maNguoiDung}

@app.post("/api/users/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(NguoiDung).filter(NguoiDung.tenDangNhap == user.tenDangNhap).first()
    
    if not db_user or not verify_password(user.matKhau, db_user.matKhau):
        return {"status": "error", "message": "Tài khoản hoặc mật khẩu không chính xác!"}
    
    access_token = create_access_token(data={"sub": db_user.tenDangNhap})
    
    return {
        "status": "success", 
        "data": {
            "maNguoiDung": db_user.maNguoiDung,
            "hoTen": db_user.hoTen,
            "email": db_user.email,
            "tenDangNhap": db_user.tenDangNhap
        },
        "token": access_token
    }

@app.post("/api/progress/complete")
def mark_lesson_complete(progress: TienDoHocRequest, db: Session = Depends(get_db)):
    db_progress = db.query(TienDoHoc).filter(
        TienDoHoc.maNguoiDung == progress.maNguoiDung,
        TienDoHoc.maBaiHoc == progress.maBaiHoc
    ).first()

    if db_progress:
        db_progress.daHoanThanh = True
        db_progress.thoiGianHoanThanh = datetime.now()
    else:
        new_progress = TienDoHoc(
            maNguoiDung=progress.maNguoiDung,
            maBaiHoc=progress.maBaiHoc,
            daHoanThanh=True,
            thoiGianHoanThanh=datetime.now()
        )
        db.add(new_progress)
    
    db.commit()
    
    return {"status": "success", "message": "Đã lưu tiến độ học thành công!"}

@app.get("/api/progress/user/{user_id}/course/{course_id}")
def get_course_progress(user_id: int, course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(BaiHoc.maBaiHoc).filter(BaiHoc.maKhoaHoc == course_id).all()
    
    lesson_ids = [lesson.maBaiHoc for lesson in lessons]
    total_lessons = len(lesson_ids)
    
    if total_lessons == 0:
        return {"status": "success", "progress_percent": 0, "message": "Khóa học này chưa có bài học nào."}
        
    completed_count = db.query(TienDoHoc).filter(
        TienDoHoc.maNguoiDung == user_id,
        TienDoHoc.maBaiHoc.in_(lesson_ids),
        TienDoHoc.daHoanThanh == True
    ).count()
    
    percent = round((completed_count / total_lessons) * 100)
    
    return {
        "status": "success", 
        "course_id": course_id,
        "completed_lessons": completed_count,
        "total_lessons": total_lessons,
        "progress_percent": percent
    }