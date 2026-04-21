from sqlalchemy import Column, Integer, String, NVARCHAR, Boolean, DateTime, Text, ForeignKey
from database import Base

class TienDoHoc(Base):
    __tablename__ = "TienDoHoc"

    maNguoiDung = Column(Integer, ForeignKey("NguoiDung.maNguoiDung"), primary_key=True)
    maBaiHoc = Column(Integer, ForeignKey("BaiHoc.maBaiHoc"), primary_key=True)

    daHoanThanh = Column(Boolean, default=False)
    thoiGianHoanThanh = Column(DateTime(timezone=True))

class KhoaHoc(Base):
    __tablename__ = "KhoaHoc"

    maKhoaHoc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenKhoaHoc = Column(NVARCHAR(255))
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
