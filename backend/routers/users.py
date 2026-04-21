from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import NguoiDung
from schemas import NguoiDungDangKy, UserLogin
from auth import get_password_hash, verify_password, create_access_token

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.post("/register")
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

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(NguoiDung).filter(
        NguoiDung.tenDangNhap == user.tenDangNhap
    ).first()

    if not db_user or not verify_password(user.matKhau, db_user.matKhau):
        raise HTTPException(
            status_code=401,
            detail="Tài khoản hoặc mật khẩu không chính xác"
        )

    access_token = create_access_token({
        "sub": db_user.tenDangNhap,
        "user_id": db_user.maNguoiDung
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "maNguoiDung": db_user.maNguoiDung,
            "hoTen": db_user.hoTen,
            "email": db_user.email,
            "tenDangNhap": db_user.tenDangNhap
        }
    }
