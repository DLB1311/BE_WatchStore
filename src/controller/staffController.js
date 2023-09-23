const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require("../middleware/auth");
const dotenv = require("dotenv");


dotenv.config();


let signInAdmin = async (req, res) => {
    const username = req.body.phoneOrEmail;
    const password = req.body.password;

    try {  
      // Check if the username is a valid email or phone number
      let user;
      if (validator.isEmail(username)) {
        const emailQuery = `SELECT * FROM NHANVIEN WHERE Email = @username`;
        const emailResult = await pool.request().input('username', sql.NVarChar(50), username).query(emailQuery);
        user = emailResult.recordset[0];
      } else {
        const phoneQuery = `SELECT * FROM NHANVIEN WHERE SDT = @username`;
        const phoneResult = await pool.request().input('username', sql.NVarChar(15), username).query(phoneQuery);
        user = phoneResult.recordset[0];
      }
      console.log(await bcrypt.hash(password,10 ));
      console.log(user.Password);
      console.log(await bcrypt.compare(password, user.Password));

      if (!user || !(await bcrypt.compare(password, user.Password) ) ) {  
        return res.status(401).json({
          success: false,
          message: "Số điện thoại/Email hoặc mật khẩu không trùng khớp!",
        });
      }
      
      console.log(user.MaNV);
      // Tạo token và trả về cho người dùng
      const payload = {
        userId: user.MaNV,
        maQuyen: user.MaQuyen // Add the MaQuyen to the token payload
      };
      const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '1d' });
      return res.status(201).json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
        customer: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Không tìm thấy username" });
    }
};

const getDeliveryEmployees = async (req, res) => {
  try {
    const query = `
    SELECT
    NV.MaNV,
    NV.Ho,
    NV.Ten,
    NV.SDT,
    NV.Email,
    COUNT(PD.MaNVGiao) AS NumberOfOrders
  FROM
    NHANVIEN NV
  LEFT JOIN
    PHIEUDAT PD ON NV.MaNV = PD.MaNVGiao AND PD.TrangThai = 2
  WHERE
    NV.MaQuyen = 'GH'
  GROUP BY
    NV.MaNV, NV.Ho, NV.Ten, NV.SDT, NV.Email
  ORDER BY
    NumberOfOrders ASC;
    `;

    const result = await pool.request().query(query);
    const deliveryEmployees = result.recordset;

    return res.status(200).json({
      success: true,
      deliveryEmployees,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error retrieving delivery employees" });
  }
};

let getInfoStaffByToken = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  try {  
    const data = await pool.query(`
    SELECT
      NV.MaNV,
      NV.Ho,
      NV.Ten,
      NV.SDT,
      NV.Email,
      NV.MaQuyen
    FROM
      NHANVIEN NV
    WHERE
      NV.MaNV = '${userId}'
  `);

    return res.status(201).json({
      success: true,
      data: data.recordset[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Không tìm thấy username" });
  }
};


const getAllStaff = async (req, res) => {
  try {
    const query = `
    SELECT
    NV.*,
    Q.TenQuyen
  FROM
    NHANVIEN NV
  INNER JOIN
    QUYEN Q ON NV.MaQuyen = Q.MaQuyen
    `;

    const result = await pool.request().query(query);
    const staffList = result.recordset;

    return res.status(200).json({
      success: true,
      staffList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error retrieving staff list" });
  }
};

const addStaffMember = async (req, res) => {
  // Get the list of existing staff members
  const existingStaff = await getAllStaffMembers();

  // Generate the next staff member ID
  const nextStaffId = generateNextStaffId(existingStaff);

  const {
    Ho,
    Ten,
    GioiTinh,
    NgaySinh,
    DiaChi,
    SDT,
    Email,
    Password,
    MaQuyen,
  } = req.body;

  // Check if the phone number has more than 10 digits
  if (SDT.length < 10) {
    return res.status(400).json({
      success: false,
      message: "Phone number must have more than 9 digits",
    });
  }

  try {
    // Hash the password before inserting
    const hashedPassword = await bcrypt.hash(Password, 10);

    const insertQuery = `
      INSERT INTO NHANVIEN (MaNV, Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password, MaQuyen)
      VALUES (@MaNV, @Ho, @Ten, @GioiTinh, @NgaySinh, @DiaChi, @SDT, @Email, @Password, @MaQuyen)
    `;

    await pool.request()
      .input("MaNV", sql.NVarChar(10), nextStaffId)
      .input("Ho", sql.NVarChar(50), Ho)
      .input("Ten", sql.NVarChar(20), Ten)
      .input("GioiTinh", sql.Bit, GioiTinh)
      .input("NgaySinh", sql.Date, NgaySinh)
      .input("DiaChi", sql.NVarChar(200), DiaChi)
      .input("SDT", sql.NVarChar(15), SDT)
      .input("Email", sql.NVarChar(50), Email)
      .input("Password", sql.NVarChar(200), hashedPassword) // Use the hashed password
      .input("MaQuyen", sql.NVarChar(10), MaQuyen)
      .query(insertQuery);

    res.status(201).json({
      success: true,
      message: "Staff member added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Function to get all existing staff members
const getAllStaffMembers = async () => {
  try {
    const query = `
      SELECT MaNV
      FROM NHANVIEN
    `;

    const result = await pool.request().query(query);
    const staffList = result.recordset;
    return staffList.map(staff => staff.MaNV);
  } catch (error) {
    console.error(error);
    return [];
  }
};
// Function to generate the next staff member ID
const generateNextStaffId = existingStaff => {
  const maxId = existingStaff.reduce((max, id) => {
    const numericId = parseInt(id.slice(2)); // Convert 'NV001' to 1
    return numericId > max ? numericId : max;
  }, 0);

  const nextIdNumber = maxId + 1;
  const nextId = `NV${nextIdNumber.toString().padStart(3, '0')}`;
  return nextId;
};

const getAllRoleStaff = async (req, res) => {
  try {
    const query = `
    SELECT
    *
    FROM
      QUYEN 
    WHERE
      MaQuyen <> 'KH'; 
    `;

    const result = await pool.request().query(query);
    const roleList = result.recordset;

    return res.status(200).json({
      success: true,
      roleList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error retrieving staff list" });
  }
};

const updateStaffMember = async (req, res) => {
  const staffId = req.params.staffId; 
  const {
      Ho,
      Ten,
      GioiTinh,
      NgaySinh,
      DiaChi,
      SDT,
      Email,
      MaQuyen,
  } = req.body;

  try {
      const updateQuery = `
          UPDATE NHANVIEN
          SET
              Ho = @Ho,
              Ten = @Ten,
              GioiTinh = @GioiTinh,
              NgaySinh = @NgaySinh,
              DiaChi = @DiaChi,
              SDT = @SDT,
              Email = @Email,
              MaQuyen = @MaQuyen
          WHERE MaNV = @staffId;
      `;

      await pool.request()
          .input('Ho', sql.NVarChar(50), Ho)
          .input('Ten', sql.NVarChar(20), Ten)
          .input('GioiTinh', sql.Bit, GioiTinh)
          .input('NgaySinh', sql.Date, NgaySinh)
          .input('DiaChi', sql.NVarChar(200), DiaChi)
          .input('SDT', sql.NVarChar(15), SDT)
          .input('Email', sql.NVarChar(50), Email)
          .input('MaQuyen', sql.NVarChar(10), MaQuyen)
          .input('staffId', sql.NVarChar(10), staffId)
          .query(updateQuery);

      return res.status(200).json({
          success: true,
          message: "Staff member information updated successfully",
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const deleteStaffMember = async (req, res) => {
  const staffId = req.params.staffId;

  try {

      // If there are no linked records, proceed with deletion
      const deleteQuery = `
          DELETE FROM NHANVIEN
          WHERE MaNV = @staffId;
      `;

      await pool.request().input('staffId', sql.NVarChar(10), staffId).query(deleteQuery);

      return res.status(200).json({
          success: true,
          message: "Staff member deleted successfully.",
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const changeStaffPassword = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  try {
    // Get the current user's information
    const userQuery = `SELECT * FROM NHANVIEN WHERE MaNV = @userId`;
    const userResult = await pool
      .request()
      .input("userId", sql.NVarChar(10), userId)
      .query(userQuery);

    const user = userResult.recordset[0];

    // Check if the entered current password matches the stored password
    if (!(await bcrypt.compare(currentPassword, user.Password))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updateQuery = `
      UPDATE NHANVIEN
      SET Password = @newPassword
      WHERE MaNV = @userId;
    `;

    await pool
      .request()
      .input("newPassword", sql.NVarChar(200), hashedNewPassword)
      .input("userId", sql.NVarChar(10), userId)
      .query(updateQuery);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};



module.exports = {
    signInAdmin,
    getDeliveryEmployees,
    getInfoStaffByToken,  
    getAllStaff,
    addStaffMember,
     getAllRoleStaff, 
     updateStaffMember,
     deleteStaffMember,
     changeStaffPassword
};
   