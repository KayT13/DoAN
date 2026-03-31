package com.backend.doan.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "VaiTro")
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maVaiTro")
    private Integer maVaiTro;

    @Column(name = "tenVaiTro", nullable = false, length = 50)
    private String tenVaiTro;

    @ManyToMany(mappedBy = "vaiTros")
    @JsonIgnore // Quan trọng: Ngăn không cho in ngược lại danh sách người dùng khi lấy vai trò
    private Set<NguoiDung> nguoiDungs;

    // Getters and Setters
    public Integer getMaVaiTro() { return maVaiTro; }
    public void setMaVaiTro(Integer maVaiTro) { this.maVaiTro = maVaiTro; }
    public String getTenVaiTro() { return tenVaiTro; }
    public void setTenVaiTro(String tenVaiTro) { this.tenVaiTro = tenVaiTro; }
    public Set<NguoiDung> getNguoiDungs() { return nguoiDungs; }
    public void setNguoiDungs(Set<NguoiDung> nguoiDungs) { this.nguoiDungs = nguoiDungs; }
}