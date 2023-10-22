const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/SQLManager");
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require("../middleware/auth");

const dotenv = require("dotenv");
dotenv.config();

const Staff = require("../models/Staff");

const StaffDAO = require("../dao/StaffDAO");
const staffDAO = new StaffDAO();


let signInAdmin = async (req, res) => {
    const username = req.body.phoneOrEmail;
    const password = req.body.password;
    try {  
      const user = await staffDAO.findByEmailOrPhone(username);
      
      if (!user || !(await staffDAO.comparePassword(password, user.Password))) {
        return res.status(401).json({
          success: false,
          message: process.env.LOGIN_E001,
        });
      }
      const payload = {
        userId: user.MaNV,
        maQuyen: user.MaQuyen 
      };
      const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '1d' });
      return res.status(201).json({
        success: true,
        message:  process.env.LOGIN_SUCCESS,
        token,
        customer: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message:process.env.LOGIN_E001 });
    }
};

let getDeliveryEmployees = async (req, res) => {
  try {
    const deliveryEmployees = await staffDAO.getDeliveryEmployees();

    return res.status(200).json({
      success: true,
      deliveryEmployees,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001});
  }
};

let getInfoStaffByToken = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  try {  
    const data = await staffDAO.getInfoStaffByToken(userId);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message:process.env.GETSTAFF_E001});
  }
};

let getAllStaff = async (req, res) => {
  try {
    const staffList = await staffDAO.getAllStaff();

    return res.status(200).json({
      success: true,
      staffList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.GETSTAFF_E001 });
  }
};

const addStaffMember = async (req, res) => {
  const staffData = req.body;
  try {

    if (staffData.SDT.length < 10) {
      return res.status(401).json({
      success: false,
      message: process.env.PHONE_ERROR,
      });
    }
    const result = await staffDAO.addStaffMember(staffData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

const getAllRoleStaff = async (req, res) => {
  try {
    const roleList = await staffDAO.getAllRoleStaff();

    return res.status(200).json({
      success: true,
      roleList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false,  message: process.env.ERROR_E001 });
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
    // Create a Staff instance with the updated data
    const updatedStaff = new Staff({
      MaNV: staffId,
      Ho,
      Ten,
      GioiTinh,
      NgaySinh,
      DiaChi,
      SDT,
      Email,
      MaQuyen,
    });

    // Call the StaffDAO method to update the staff member
    await staffDAO.updateStaffMember(updatedStaff);

    return res.status(200).json({
      success: true,
      message:process.env.EDITSTAFF_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: process.env.ERROR_E001});
  }
};

const deleteStaffMember = async (req, res) => {
  const staffId = req.params.staffId;

  try {
    // Call the StaffDAO method to delete the staff member
    await staffDAO.deleteStaffMember(staffId);

    return res.status(200).json({
      success: true,
      message: process.env.DELSTAFF_SUCCESS,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001});
  }
};

const changeStaffPassword = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  try {
    if (!newPassword) {
    return res.status(500).json({
      success: false,
      message: process.env.VALIDATION_PASSWORD_E001,
    });
    }

    // Call the StaffDAO method to change the staff member's password
    await staffDAO.changeStaffPassword(userId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: process.env.CHANGEPASS_SUCCESS,
    });
    
  } catch (error) {
    if (error.message === "Incorrect password") {
      return res.status(401).json({
        success: false,
        message: process.env.CHANGEPASS_E001,
      });
    } else {
      console.error(error);
      return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }
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
   