from fastapi import FastAPI, Depends
from sqlalchemy import Column, Integer, String, NVARCHAR
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from pydantic import BaseModel
import bcrypt 
from sqlalchemy import Column, Integer, String, NVARCHAR, Boolean, DateTime
import datetime
import jwt
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

# --- KHUÔN MẪU DỮ LIỆU ĐĂNG NHẬP ---
class UserLogin(BaseModel):
    tenDangNhap: str
    matKhau: str


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_password.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode('utf-8')
    hashed_password_byte_enc = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_byte_enc, hashed_password_byte_enc)

Base.metadata.create_all(bind=engine)

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# --- CẤU HÌNH JWT (JSON WEB TOKEN) ---
SECRET_KEY = "Hệ_Thống_Elearning_Của_Tôi_Mật_Khẩu_Siêu_Cấp_Vũ_Trụ" # Chìa khóa bí mật để in Token
ALGORITHM = "HS256" # Thuật toán mã hóa
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Token có hạn trong 24 giờ (1 ngày)

def create_access_token(data: dict):
    to_encode = data.copy()
    # Tính toán thời gian hết hạn
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Ký và tạo ra chuỗi Token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- THÊM ĐOẠN NÀY ĐỂ CHO PHÉP REACTJS GỌI API ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cấp quyền cho mọi Frontend (chạy cổng nào cũng được)
    allow_credentials=True,
    allow_methods=["*"], # Cho phép mọi phương thức GET, POST, PUT, DELETE
    allow_headers=["*"],
)
# ------------------------------------------------

class TienDoHoc(Base):
    __tablename__ = "TienDoHoc"

    maNguoiDung = Column(Integer, primary_key=True)
    maBaiHoc = Column(Integer, primary_key=True)
    daHoanThanh = Column(Boolean, default=False)
    thoiGianHoanThanh = Column(DateTime)

class TienDoHocRequest(BaseModel):
    maNguoiDung: int
    maBaiHoc: int

class KhoaHoc(Base):
    __tablename__ = "KhoaHoc"

    maKhoaHoc = Column(Integer, primary_key=True, index=True)
    tenKhoaHoc = Column(NVARCHAR(255))
    moTa = Column(NVARCHAR(None)) # NVARCHAR(MAX)
    trinhDo = Column(NVARCHAR(50))

@app.get("/api/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(KhoaHoc).all()
    return {"status": "success", "data": courses}
class BaiHoc(Base):
    __tablename__ = "BaiHoc"

    maBaiHoc = Column(Integer, primary_key=True, index=True)
    maKhoaHoc = Column(Integer) # Khóa ngoại liên kết với Khóa học
    tenBaiHoc = Column(NVARCHAR(255))
    noiDung = Column(NVARCHAR(None))
    thuTu = Column(Integer)

class NguoiDung(Base):
    __tablename__ = "NguoiDung"

    maNguoiDung = Column(Integer, primary_key=True, index=True)
    tenDangNhap = Column(String(50))
    matKhau = Column(String(255))
    email = Column(String(100))
    hoTen = Column(NVARCHAR(100))

class NguoiDungDangKy(BaseModel):
    tenDangNhap: str
    matKhau: str
    hoTen: str
    email: str

@app.get("/api/courses/{course_id}/lessons")
def get_lessons_by_course(course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(BaiHoc).filter(BaiHoc.maKhoaHoc == course_id).order_by(BaiHoc.thuTu).all()
    return {"status": "success", "course_id": course_id, "data": lessons}
@app.post("/api/users/register")
def register_user(user: NguoiDungDangKy, db: Session = Depends(get_db)):
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
    
class NguoiDungDangNhap(BaseModel):
    tenDangNhap: str
    matKhau: str

@app.post("/api/users/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 1. Tìm user trong DB
    db_user = db.query(User).filter(User.TenDangNhap == user.tenDangNhap).first()
    
    # 2. Kiểm tra tài khoản và mật khẩu
    if not db_user or not bcrypt.checkpw(user.matKhau.encode('utf-8'), db_user.MatKhau.encode('utf-8')):
        return {"status": "error", "message": "Tài khoản hoặc mật khẩu không chính xác!"}
    
    # 3. TẠO VÒNG TAY VIP (JWT TOKEN) NẾU ĐÚNG MẬT KHẨU
    access_token = create_access_token(data={"sub": db_user.TenDangNhap})
    
    # 4. Trả về thông tin user kèm theo cái Token đó
    return {
        "status": "success", 
        "data": {
            "hoTen": db_user.HoTen,
            "email": db_user.Email,
            "tenDangNhap": db_user.TenDangNhap
        },
        "token": access_token # <--- Trả thêm Token về cho React
    }

@app.post("/api/progress/complete")
def mark_lesson_complete(progress: TienDoHocRequest, db: Session = Depends(get_db)):
    db_progress = db.query(TienDoHoc).filter(
        TienDoHoc.maNguoiDung == progress.maNguoiDung,
        TienDoHoc.maBaiHoc == progress.maBaiHoc
    ).first()

    if db_progress:
        db_progress.daHoanThanh = True
        db_progress.thoiGianHoanThanh = datetime.datetime.now()
    else:
        new_progress = TienDoHoc(
            maNguoiDung=progress.maNguoiDung,
            maBaiHoc=progress.maBaiHoc,
            daHoanThanh=True,
            thoiGianHoanThanh=datetime.datetime.now()
        )
        db.add(new_progress)
    
    db.commit()
    
    return {"status": "success", "message": "Đã lưu tiến độ học thành công!"}
# API GET: Lấy phần trăm tiến độ học của User trong một Khóa học
@app.get("/api/progress/user/{user_id}/course/{course_id}")
def get_course_progress(user_id: int, course_id: int, db: Session = Depends(get_db)):
    # 1. Lấy danh sách ID các bài học thuộc khóa học này
    lessons = db.query(BaiHoc.maBaiHoc).filter(BaiHoc.maKhoaHoc == course_id).all()
    
    # Tạo một mảng chỉ chứa các số ID bài học (VD: [1, 2, 3])
    lesson_ids = [lesson.maBaiHoc for lesson in lessons]
    total_lessons = len(lesson_ids)
    
    if total_lessons == 0:
        return {"status": "success", "progress_percent": 0, "message": "Khóa học này chưa có bài học nào."}
        
    # 2. Đếm số bài học mà User đã hoàn thành (nằm trong danh sách bài học của khóa)
    completed_count = db.query(TienDoHoc).filter(
        TienDoHoc.maNguoiDung == user_id,
        TienDoHoc.maBaiHoc.in_(lesson_ids), # Nằm trong danh sách các bài học ở trên
        TienDoHoc.daHoanThanh == True
    ).count()
    
    # 3. Tính toán phần trăm
    percent = round((completed_count / total_lessons) * 100)
    
    return {
        "status": "success", 
        "course_id": course_id,
        "completed_lessons": completed_count,
        "total_lessons": total_lessons,
        "progress_percent": percent
    }