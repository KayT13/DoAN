from pydantic import BaseModel

class CourseOut(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    tenDangNhap: str
    matKhau: str

class TienDoHocRequest(BaseModel):
    maBaiHoc: int

class NguoiDungDangKy(BaseModel):
    tenDangNhap: str
    matKhau: str
    hoTen: str
    email: str
