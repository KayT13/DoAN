package com.backend.doan.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.doan.entity.NguoiDung;
import com.backend.doan.repository.NguoiDungRepository;

@Service
public class NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<NguoiDung> layTatCa() {
        return nguoiDungRepository.findAll();
    }

    public Optional<NguoiDung> timTheoId(Integer id) {
        return nguoiDungRepository.findById(id);
    }

    @Transactional
    public NguoiDung luuMoi(NguoiDung nguoiDung) {
        // Kiểm tra trùng lặp trước khi tạo
        if (nguoiDungRepository.existsByTenDangNhap(nguoiDung.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (nguoiDungRepository.existsByEmail(nguoiDung.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Mã hóa mật khẩu
        nguoiDung.setMatKhau(passwordEncoder.encode(nguoiDung.getMatKhau()));
        return nguoiDungRepository.save(nguoiDung);
    }

    @Transactional
    public NguoiDung capNhat(Integer id, NguoiDung duLieuMoi) {
        return nguoiDungRepository.findById(id).map(user -> {
            user.setHoTen(duLieuMoi.getHoTen());
            user.setEmail(duLieuMoi.getEmail());
            user.setSoDienThoai(duLieuMoi.getSoDienThoai());
            
            // Chỉ mã hóa lại mật khẩu nếu người dùng có nhập mật khẩu mới
            if (duLieuMoi.getMatKhau() != null && !duLieuMoi.getMatKhau().isEmpty()) {
                user.setMatKhau(passwordEncoder.encode(duLieuMoi.getMatKhau()));
            }
            
            return nguoiDungRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + id));
    }

    @Transactional
    public void xoa(Integer id) {
        if (!nguoiDungRepository.existsById(id)) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }
        nguoiDungRepository.deleteById(id);
    }
}