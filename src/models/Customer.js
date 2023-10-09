class Customer {
    constructor({
      MaKH,
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
      this.MaKH = MaKH;
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
  
  module.exports = Customer;
  