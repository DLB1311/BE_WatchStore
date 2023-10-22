const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/SQLManager");
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require("../middleware/auth");
const dotenv = require("dotenv");

const Customer = require("../models/Customer");

const CustomerDAO = require("../dao/CustomerDAO");
const customerDAO = new CustomerDAO();

dotenv.config();

let signIn = async (req, res) => {
  const username = req.body.phoneOrEmail;
  const password = req.body.password;

  if (!username) {
    return res.status(401).json({
      success: false,
      message: process.env.VALIDATION_USERNAME_E001,
    });
  }

  if (!password) {
    return res.status(401).json({
      success: false,
      message: process.env.VALIDATION_PASSWORD_E001,
    });
  }

  try {  
    // Check if the username is a valid email or phone number
    let user;
    if (validator.isEmail(username)) {
      user = await customerDAO.findByEmail(username);

    } else {
      user = await customerDAO.findByPhoneNumber(username);
    }

    if (!user || !(await customerDAO.comparePassword(password, user.Password))) {
      return res.status(401).json({
        success: false,
        message: process.env.LOGIN_E001,
      });
    }
    
    // Tạo token và trả về cho người dùng
    const token = jwt.sign({ userId: user.MaKH }, process.env.TOKEN_KEY, { expiresIn: '1d' });
    return res.status(201).json({
      success: true,
      message: process.env.LOGIN_SUCCESS,
      token,
      customer: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message:process.env.ERROR_E001});
  }
};

let signUp = async (req, res) => {
  const { Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password } = req.body;

  try {
    const result = await customerDAO.signUpCustomer({ Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password });

    if (result.success) {
      return res.status(201).json({success: true,message: result.message});
    } else {
      return res.status(500).json({success: false,message: result.message});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false,message: process.env.CUSSIGNUP_ERROR });
  }
};

let getCusProfile = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: process.env.UNAUTHORIZED_ERROR });
    }

    const result = await customerDAO.getCustomerProfile(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

let updateProfile = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: process.env.UNAUTHORIZED_ERROR });
  }

  const { Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT,Email, Password } = req.body;

  try {
    const result = await customerDAO.updateCustomerProfile(userId, {
      Ho,
      Ten,
      GioiTinh,
      NgaySinh,
      DiaChi,
      Email,
      SDT,
      Password,
    });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

const updatePassword = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ success: false, message:process.env.UNAUTHORIZED_ERROR  });
  }

  const { password } = req.body;

  try {
    const result = await customerDAO.updateCustomerPassword(userId, password);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

const placeOrder = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message:process.env.UNAUTHORIZED_ERROR });
    }

    const { lastName, firstName, address, phoneNumber, cartItems } = req.body;

    if (!userId || !lastName || !firstName || !address || !phoneNumber || !cartItems) {
      return res.status(500).json({ success: false, message: process.env.CUSSIGNUP_E001});
    }
    const result = await customerDAO.placeOrder(userId, lastName, firstName, address, phoneNumber, cartItems);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001});
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const result = await customerDAO.cancelOrder(orderId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = auth.getUserIdFromToken(req);

  try {
    const result = await customerDAO.getOrderById(orderId, userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: process.env.ERROR_E001  });
  }
};


const getOrdersByCustomerId = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);

  try {
    const result = await customerDAO.getOrdersByCustomerId(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message:process.env.ERROR_E001 });
  }
};


module.exports = {
 signIn,
 signUp,
 getCusProfile,
 updateProfile,
 updatePassword,
 placeOrder,
 cancelOrder,
 getOrderById,
 getOrdersByCustomerId
};
