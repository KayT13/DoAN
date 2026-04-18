from fastapi import FastAPI, Depends
from sqlalchemy import Column, Integer, String, NVARCHAR
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from pydantic import BaseModel
import bcrypt 
from sqlalchemy import Column, Integer, String, NVARCHAR, Boolean, DateTime
import datetime


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
def login_user(user: NguoiDungDangNhap, db: Session = Depends(get_db)):
    db_user = db.query(NguoiDung).filter(NguoiDung.tenDangNhap == user.tenDangNhap).first()
    
    if not db_user or not verify_password(user.matKhau, db_user.matKhau):
        return {"status": "error", "message": "Tài khoản hoặc mật khẩu không chính xác!"}
    
    return {
        "status": "success", 
        "message": "Đăng nhập thành công!", 
        "data": {
            "maNguoiDung": db_user.maNguoiDung,
            "hoTen": db_user.hoTen,
            "email": db_user.email
        }
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