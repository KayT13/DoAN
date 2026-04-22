from sqlalchemy import Column, Integer, String, NVARCHAR, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



class NguoiDung(Base):
    __tablename__ = "NguoiDung"

    maNguoiDung = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenDangNhap = Column(String(50), unique=True)
    matKhau = Column(String(255))  # ⚠️ phải hash
    email = Column(String(100), unique=True)
    hoTen = Column(NVARCHAR(100))

    enrollments = relationship("DangKy", back_populates="user")
    progress = relationship("TienDoHoc", back_populates="user")



class KhoaHoc(Base):
    __tablename__ = "KhoaHoc"

    maKhoaHoc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tenKhoaHoc = Column(NVARCHAR(255))
    moTa = Column(Text)
    trinhDo = Column(NVARCHAR(50))

    lessons = relationship("BaiHoc", back_populates="khoaHoc")
    enrollments = relationship("DangKy", back_populates="course")


class BaiHoc(Base):
    __tablename__ = "BaiHoc"

    maBaiHoc = Column(Integer, primary_key=True, index=True, autoincrement=True)
    maKhoaHoc = Column(Integer, ForeignKey("KhoaHoc.maKhoaHoc"))

    tenBaiHoc = Column(NVARCHAR(255))
    noiDung = Column(Text)
    thuTu = Column(Integer)

    khoaHoc = relationship("KhoaHoc", back_populates="lessons")
    progress = relationship("TienDoHoc", back_populates="lesson")


class TienDoHoc(Base):
    __tablename__ = "TienDoHoc"

    maNguoiDung = Column(Integer, ForeignKey("NguoiDung.maNguoiDung"), primary_key=True)
    maBaiHoc = Column(Integer, ForeignKey("BaiHoc.maBaiHoc"), primary_key=True)

    daHoanThanh = Column(Boolean, default=False)
    thoiGianHoanThanh = Column(DateTime(timezone=True))

    user = relationship("NguoiDung", back_populates="progress")
    lesson = relationship("BaiHoc", back_populates="progress")


class DangKy(Base):
    __tablename__ = "DangKy"

    id = Column(Integer, primary_key=True, autoincrement=True)
    maNguoiDung = Column(Integer, ForeignKey("NguoiDung.maNguoiDung"))
    maKhoaHoc = Column(Integer, ForeignKey("KhoaHoc.maKhoaHoc"))

    user = relationship("NguoiDung", back_populates="enrollments")
    course = relationship("KhoaHoc", back_populates="enrollments")