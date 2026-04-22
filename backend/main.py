from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các thành phần nội bộ
from database import engine, Base
from routers import courses, users, progress
from routers import student

app.include_router(student.router)

# Tạo các bảng trong CSDL nếu chưa có (nên dùng Alembic cho dự án thực tế)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DoAN API")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Có thể giới hạn lại các domain được phép gọi API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các Router
app.include_router(courses.router)
app.include_router(users.router)
app.include_router(progress.router)

@app.get("/")
def root():
    return {"message": "Welcome to DoAN API!"}