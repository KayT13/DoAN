package com.backend.doan.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "NguoiDung")
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maNguoiDung")
    private Integer maNguoiDung;

    @Column(name = "tenDangNhap", unique = true, length = 50)
    private String tenDangNhap;

    @Column(name = "matKhau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "soDienThoai", length = 15)
    private String soDienThoai;

    @Column(name = "hoTen", length = 100)
    private String hoTen;

    @Column(name = "ngaySinh")
    private LocalDate ngaySinh;

    @Column(name = "gioiTinh", length = 10)
    private String gioiTinh;

    @Column(name = "trangThai", length = 20)
    private String trangThai;

    @Column(name = "ngayTao", insertable = false, updatable = false)
    private LocalDateTime ngayTao;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "NguoiDung_VaiTro",
            joinColumns = @JoinColumn(name = "maNguoiDung"),
            inverseJoinColumns = @JoinColumn(name = "maVaiTro")
    )
    private Set<VaiTro> vaiTros;

    public NguoiDung() {
    }


    public Integer getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(Integer maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
    }

    public String getTenDangNhap() {
        return tenDangNhap;
    }

    public void setTenDangNhap(String tenDangNhap) {
        this.tenDangNhap = tenDangNhap;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public LocalDate getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(LocalDate ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public String getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(String gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public LocalDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(LocalDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public Set<VaiTro> getVaiTros() {
        return vaiTros;
    }

    public void setVaiTros(Set<VaiTro> vaiTros) {
        this.vaiTros = vaiTros;
    }
}