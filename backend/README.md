# DoAN
- MVP ( trong đồ án 3 )
    +Trang chủ: User to, login/login.
    +Trang Học Tập: Xem danh sách bài học (Ngữ pháp + Từ vựng).
    +Trang Từ Điển: Gõ từ khóa, web tự động tra cứu (nhờ dữ liệu bạn cào sẵn).
    +Trang Bài Tập: Làm bài trắc nghiệm 10 câu, nộp bài, hệ thống chấm điểm ngay lập tức bằng API Backend và lưu vào MySQL.
    +Trang Cá Nhân (Dashboard): Hiển thị biểu đồ tiến trình học tập đẹp mắt.
- data base 4 phân hệ 
    + phân hệ 1 : hệ thống tài khoản
        +NguoiDung: Lưu thông tin user.
        +VaiTro: Các quyền (Admin, Học viên, Giảng viên).
        +NguoiDung_VaiTro: Liên kết người dùng với quyền.
    + phân hệ 2: Phân hệ 2: Khung Nội dung Học tập (Core MVP - Bắt lực)
        +KhoaHoc & BaiHoc: Nền tảng nội dung chính của web.
        +TaiLieu: Chứa link file âm thanh từ vựng hoặc ngữ pháp PDF.
        +TienDoHoc: Lưu lại người dùng đã học xong bài nào.
    +Phân hệ 3: Lớp học & Bài tập (Làm sau khi hoàn thành Core MVP) - mục tiêu của đồ án 4 
        +LopHoc & LopHoc_BaiHoc: Phân chia bài học theo từng lớp.
        +DangKy: User đăng ký vào lớp.
        +BaiTap & NopBai: Hệ thống giao bài và trách bài tự luận/trắc nghiệm.
        +LichHoc & DiemDanh: Theo dõi việc làm của lớp.
    + phân hệ 4: Thương mại & Chăm sóc (Chỉ làm khi đồ án yêu cầu)
        +HoaDon & ThanhToan: Quá trình mua khóa học.
        +ThongBao & NguoiDung_ThongBao: Gửi thông báo hệ thống.
        +DanhGia: Review, chấm sao khóa học.
-bắt đầu đồ án 3 với phân hệ 1 và 2:
    + Phân hệ 1 (Tài khoản): Hệ thống tài khoản (User & Auth)
        sql 
                -- 1. Bảng Vai trò
        CREATE TABLE VaiTro (
            maVaiTro INT AUTO_INCREMENT PRIMARY KEY,
            tenVaiTro VARCHAR(50) NOT NULL UNIQUE -- VD: 'ADMIN', 'STUDENT'
        );

        -- 2. Bảng Người dùng
        CREATE TABLE NguoiDung (
            maNguoiDung INT AUTO_INCREMENT PRIMARY KEY,
            tenDangNhap VARCHAR(50) NOT NULL UNIQUE,
            matKhau VARCHAR(255) NOT NULL, -- Sẽ lưu mã hóa Hash
            email VARCHAR(100) UNIQUE,
            hoTen VARCHAR(100) NOT NULL,
            ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
            trangThai VARCHAR(20) DEFAULT 'ACTIVE'
        );

        -- 3. Bảng trung gian NguoiDung_VaiTro (Quan hệ n-n)
        CREATE TABLE NguoiDung_VaiTro (
            maNguoiDung INT,
            maVaiTro INT,
            PRIMARY KEY (maNguoiDung, maVaiTro),
            FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung) ON DELETE CASCADE,
            FOREIGN KEY (maVaiTro) REFERENCES VaiTro(maVaiTro) ON DELETE CASCADE
        );
    + Phân hệ 2 (Nội dung học): Nội dung học tập & Tiến độ (Nội dung cốt lõi)
        sql
        -- 4. Bảng Khóa học
        CREATE TABLE KhoaHoc (
            maKhoaHoc INT AUTO_INCREMENT PRIMARY KEY,
            tenKhoaHoc VARCHAR(255) NOT NULL,
            moTa TEXT,
            trinhDo VARCHAR(50), -- Sơ cấp, Trung cấp...
            ngayTao DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- 5. Bảng Bài học
        CREATE TABLE BaiHoc (
            maBaiHoc INT AUTO_INCREMENT PRIMARY KEY,
            maKhoaHoc INT,
            tenBaiHoc VARCHAR(255) NOT NULL,
            noiDung TEXT, -- Có thể lưu nội dung ngữ pháp ở đây
            thuTu INT, -- Thứ tự bài học trong khóa
            FOREIGN KEY (maKhoaHoc) REFERENCES KhoaHoc(maKhoaHoc) ON DELETE CASCADE
        );

        -- 6. Bảng Tài liệu (Dùng để lưu Audio/Ảnh từ vựng cào được)
        CREATE TABLE TaiLieu (
            maTaiLieu INT AUTO_INCREMENT PRIMARY KEY,
            maBaiHoc INT,
            tenFile VARCHAR(255),
            duongDan TEXT, -- Link file audio phát âm hoặc ảnh minh họa
            loaiFile VARCHAR(50), -- 'audio', 'image', 'pdf'
            FOREIGN KEY (maBaiHoc) REFERENCES BaiHoc(maBaiHoc) ON DELETE CASCADE
        );

        -- 7. Bảng Tiến độ học (Lưu vết xem user đã học xong bài nào chưa)
        CREATE TABLE TienDoHoc (
            maNguoiDung INT,
            maBaiHoc INT,
            daHoanThanh BOOLEAN DEFAULT FALSE,
            thoiGianHoanThanh DATETIME,
            PRIMARY KEY (maNguoiDung, maBaiHoc),
            FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung) ON DELETE CASCADE,
            FOREIGN KEY (maBaiHoc) REFERENCES BaiHoc(maBaiHoc) ON DELETE CASCADE
        );
