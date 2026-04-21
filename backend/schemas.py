from pydantic import BaseModel

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
