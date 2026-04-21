from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import KhoaHoc, BaiHoc

router = APIRouter(
    prefix="/api/courses",
    tags=["courses"]
)

@router.get("")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(KhoaHoc).all()
    result = []
    for c in courses:
        result.append({
            "maKhoaHoc": c.maKhoaHoc,
            "tenKhoaHoc": c.tenKhoaHoc,
            "moTa": c.moTa,
            "trinhDo": c.trinhDo
        })
    return {"status": "success", "data": result}

@router.get("/{course_id}/lessons")
def get_lessons_by_course(course_id: int, db: Session = Depends(get_db)):
    lessons = db.query(BaiHoc).filter(BaiHoc.maKhoaHoc == course_id).order_by(BaiHoc.thuTu).all()
    return {"status": "success", "course_id": course_id, "data": lessons}
