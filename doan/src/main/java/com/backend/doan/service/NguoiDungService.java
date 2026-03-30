package com.backend.doan.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.doan.entity.NguoiDung;
import com.backend.doan.repository.NguoiDungRepository;

@Service
public class NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    // Lấy danh sách tất cả người dùng
    public List<NguoiDung> layTatCa() {
        return nguoiDungRepository.findAll();
    }

    // Tìm người dùng theo ID (maNguoiDung)
    public Optional<NguoiDung> timTheoId(Integer id) {
        return nguoiDungRepository.findById(id);
    }

    // Tìm người dùng theo tên đăng nhập (dùng cho Đăng nhập)
    public Optional<NguoiDung> timTheoTenDangNhap(String tenDangNhap) {
        return nguoiDungRepository.findByTenDangNhap(tenDangNhap);
    }

    // Thêm mới hoặc Cập nhật thông tin người dùng
    public NguoiDung luuNguoiDung(NguoiDung nguoiDung) {
        // Nếu là thêm mới (chưa có ID), ta cần kiểm tra xem username hoặc email đã bị trùng chưa
        if (nguoiDung.getMaNguoiDung() == null) {
            if (nguoiDungRepository.existsByTenDangNhap(nguoiDung.getTenDangNhap())) {
                throw new RuntimeException("Lỗi: Tên đăng nhập đã tồn tại!");
            }
            if (nguoiDungRepository.existsByEmail(nguoiDung.getEmail())) {
                throw new RuntimeException("Lỗi: Email đã được sử dụng!");
            }
            
         
        }
        
        // Lưu vào CSDL
        return nguoiDungRepository.save(nguoiDung);
    }

    // Xóa người dùng theo ID
    public void xoaNguoiDung(Integer id) {
        nguoiDungRepository.deleteById(id);
    }
}