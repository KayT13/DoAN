from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import TienDoHoc, BaiHoc
from schemas import TienDoHocRequest
from auth import verify_token

router = APIRouter(
    prefix="/api/progress",
    tags=["progress"]
)

@router.post("/complete")
def mark_lesson_complete(progress: TienDoHocRequest, user_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    ma_nguoi_dung = user_data["user_id"]
    db_progress = db.query(TienDoHoc).filter(
        TienDoHoc.maNguoiDung == ma_nguoi_dung,
        TienDoHoc.maBaiHoc == progress.maBaiHoc
    ).first()

    if db_progress:
        db_progress.daHoanThanh = True
        db_progress.thoiGianHoanThanh = datetime.now()
    else:
        new_progress = TienDoHoc(
            maNguoiDung=ma_nguoi_dung,
            maBaiHoc=progress.maBaiHoc,
            daHoanThanh=True,
            thoiGianHoanThanh=datetime.now()
        )
        db.add(new_progress)
    
    db.commit()
    
    return {"status": "success", "message": "Đã lưu tiến độ học thành công!"}

@router.get("/user/{user_id}/course/{course_id}")
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
