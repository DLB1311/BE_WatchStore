class Staff {
  constructor({
    MaNV,
    Ho,
    Ten,
    GioiTinh,
    NgaySinh,
    DiaChi,
    SDT,
    Email,
    Password,
    MaQuyen,
  }) {
    this.MaNV = MaNV;
    this.Ho = Ho;
    this.Ten = Ten;
    this.GioiTinh = GioiTinh;
    this.NgaySinh = NgaySinh;
    this.DiaChi = DiaChi;
    this.SDT = SDT;
    this.Email = Email;
    this.Password = Password;
    this.MaQuyen = MaQuyen;
  }
}

module.exports = Staff;
