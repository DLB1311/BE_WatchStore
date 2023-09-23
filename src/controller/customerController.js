const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require("../middleware/auth");
const dotenv = require("dotenv");


dotenv.config();

let signIn = async (req, res) => {
    const username = req.body.phoneOrEmail;
    const password = req.body.password;
  
    try {  
      // Check if the username is a valid email or phone number
      let user;
      if (validator.isEmail(username)) {
        const emailQuery = `SELECT * FROM KHACHHANG WHERE Email = @username`;
        const emailResult = await pool.request().input('username', sql.NVarChar(50), username).query(emailQuery);
        user = emailResult.recordset[0];
      } else {
        const phoneQuery = `SELECT * FROM KHACHHANG WHERE SDT = @username`;
        const phoneResult = await pool.request().input('username', sql.NVarChar(15), username).query(phoneQuery);
        user = phoneResult.recordset[0];
      }
  
      if (!user || !(await bcrypt.compare(password, user.Password))) {
        return res.status(401).json({
          success: false,
          message: "Số điện thoại/Email hoặc mật khẩu không trùng khớp!",
        });
      }
      
      console.log( user.MaKH );
      // Tạo token và trả về cho người dùng
      const token = jwt.sign({ userId: user.MaKH }, process.env.TOKEN_KEY, { expiresIn: '1d' });
      return res.status(201).json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
        customer: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred" });
    }
};
let signUp = async (req, res) => {
    const { Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password } = req.body;
  
    if (!Ho || !Ten || !GioiTinh || !NgaySinh || !DiaChi || !SDT || !Email || !Password) {
      return res.status(400).json({
        success: false,
        code: "e001",
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }
  
    if (SDT.length !== 10 || !/^[0-9]*$/.test(SDT)) {
      return res.status(400).json({
        success: false,
        code: "e004",
        message: "Số điện thoại không hợp lệ! Số điện thoại phải có 10 chữ số",
      });
    }
  
    if (!validator.isEmail(Email)) {
      return res.status(400).json({
        success: false,
        code: "e004",
        message: "Email không hợp lệ! Vui lòng nhập đúng định dạng email",
      });
    }
  
    // Check if phone number or email already exists in the database
    const phoneQuery = `SELECT COUNT(*) AS phoneCount FROM KHACHHANG WHERE SDT = @SDT`;
    const emailQuery = `SELECT COUNT(*) AS emailCount FROM KHACHHANG WHERE Email = @Email`;
  
    try {
      const phoneResult = await pool.request().input('SDT', sql.NVarChar(15), SDT).query(phoneQuery);
      const emailResult = await pool.request().input('Email', sql.NVarChar(50), Email).query(emailQuery);
  
      if (phoneResult.recordset[0].phoneCount > 0) {
        return res.status(409).json({
          success: false,
          code: "e001",
          message: "Số điện thoại đã được sử dụng cho tài khoản khác",
        });
      }
  
      if (emailResult.recordset[0].emailCount > 0) {
        return res.status(409).json({
          success: false,
          code: "e001",
          message: "Email đã được sử dụng cho tài khoản khác",
        });
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Insert the new user into the database with default role "KH" (Customer)
      const insertQuery = `
        INSERT INTO KHACHHANG (Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, Password, MaQuyen)
        VALUES (@Ho, @Ten, @GioiTinh, @NgaySinh, @DiaChi, @SDT, @Email, @Password, 'KH')
      `;
  
      await pool.request()
        .input('Ho', sql.NVarChar(50), Ho)
        .input('Ten', sql.NVarChar(20), Ten)
        .input('GioiTinh', sql.Bit, GioiTinh)
        .input('NgaySinh', sql.Date, NgaySinh)
        .input('DiaChi', sql.NVarChar(200), DiaChi)
        .input('SDT', sql.NVarChar(15), SDT)
        .input('Email', sql.NVarChar(50), Email)
        .input('Password', sql.NVarChar(200), hashedPassword)
        .query(insertQuery);
  
      return res.status(201).json({
        success: true,
        code: "e000",
        message: "Đăng kí tài khoản thành công",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        code: "e001",
        message: "Đăng ký tài khoản thất bại, vui lòng thử lại sau",
      });
    }
};
let getCusProfile = async (req, res) => {
    try {
      const userId = auth.getUserIdFromToken(req);
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
  
      // Query the database to get the customer profile
      const query = `SELECT * FROM KHACHHANG WHERE MaKH = @userId`;
      const result = await pool.request().input('userId', sql.Int, userId).query(query);
  
      const customer = result.recordset[0];
  
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      // Return the customer profile
      return res.status(200).json({ success: true, customer });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred" });
    }
};
const updateProfile = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { Ho, Ten, GioiTinh, NgaySinh, DiaChi, SDT, Email, password } = req.body;

  // Additional validation if needed

  try {
    // Check if the user exists
    const userQuery = `SELECT * FROM KHACHHANG WHERE MaKH = @userId`;
    const userResult = await pool.request().input('userId', sql.Int, userId).query(userQuery);
    const user = userResult.recordset[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user's profile data in the database
    let updateQuery = `
      UPDATE KHACHHANG
      SET Ho = @Ho, Ten = @Ten, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh, DiaChi = @DiaChi, Email = @Email
      WHERE MaKH = @userId
    `;

    // Only update the password if it is provided in the request body
    if (password) {
      updateQuery = `
        UPDATE KHACHHANG
        SET Ho = @Ho, Ten = @Ten, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh, DiaChi = @DiaChi, Email = @Email, password = @password
        WHERE MaKH = @userId
      `;
    }

    await pool.request()
      .input('Ho', sql.NVarChar(50), Ho)
      .input('Ten', sql.NVarChar(20), Ten)
      .input('GioiTinh', sql.Bit, GioiTinh)
      .input('NgaySinh', sql.Date, NgaySinh)
      .input('DiaChi', sql.NVarChar(200), DiaChi)
      .input('Email', sql.NVarChar(50), Email)
      .input('password', sql.NVarChar(255), password) // Add password input here
      .input('userId', sql.Int, userId)
      .query(updateQuery);

    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
const updatePassword = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { password } = req.body;

  // Additional validation if needed

  try {
    // Check if the user exists
    const userQuery = `SELECT * FROM KHACHHANG WHERE MaKH = @userId`;
    const userResult = await pool.request().input('userId', sql.Int, userId).query(userQuery);
    const user = userResult.recordset[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update the user's password in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateQuery = `
      UPDATE KHACHHANG
      SET password = @password
      WHERE MaKH = @userId
    `;

    await pool.request()
      .input('password', sql.NVarChar(255), hashedPassword)
      .input('userId', sql.Int, userId)
      .query(updateQuery);

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { lastName, firstName, address, phoneNumber, cartItems } = req.body;

    // Begin a transaction
    const transaction = new sql.Transaction(pool);

    try {
      // Start the transaction
      await transaction.begin();

      // Insert into PHIEUDAT table
      const orderQuery = `INSERT INTO PHIEUDAT (NgayDat, HoNN, TenNN, DiaChiNN, SDT, TrangThai, MaKH) 
                          VALUES (GETDATE(), @HoNN, @TenNN, @DiaChiNN, @SDT, 0, @MaKH);
                          SELECT SCOPE_IDENTITY() AS NewOrderID;`;

      const orderResult = await transaction.request()
        .input('HoNN', sql.NVarChar(50), lastName)
        .input('TenNN', sql.NVarChar(20), firstName)
        .input('DiaChiNN', sql.NVarChar(200), address)
        .input('SDT', sql.NVarChar(15), phoneNumber)
        .input('MaKH', sql.Int, userId)
        .query(orderQuery);

      const orderId = orderResult.recordset[0].NewOrderID;

      // Insert into CTPHIEUDAT table
      for (const item of cartItems) {
        const cartItemQuery = `INSERT INTO CTPHIEUDAT (MaPD, MaDH, SoLuong, DonGia) 
                               VALUES (@MaPD, @MaDH, @SoLuong, @DonGia);`;

        await transaction.request()
          .input('MaPD', sql.Int, orderId)
          .input('MaDH', sql.NVarChar(10), item.productId)
          .input('SoLuong', sql.Int, item.quantity)
          .input('DonGia', sql.Float, item.price)
          .query(cartItemQuery);
      }

      // Commit the transaction
      await transaction.commit();

      // Return the successful response
      return res.status(200).json({ success: true, message: "Order placed successfully", MaPD: orderId });
    } catch (error) {
      // Rollback the transaction if there's an error
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred while placing the order" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Begin a transaction
    const transaction = new sql.Transaction(pool);

    try {
      // Start the transaction
      await transaction.begin();

      // Retrieve order details
      const getOrderQuery = `SELECT TrangThai FROM PHIEUDAT WHERE MaPD = @MaPD;`;
      const getOrderResult = await transaction.request()
        .input('MaPD', sql.Int, orderId)
        .query(getOrderQuery);

      if (!getOrderResult.recordset[0]) {
        // Order not found
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const orderStatus = getOrderResult.recordset[0].TrangThai;

      if (orderStatus === 4) {
        // Order is already canceled
        return res.status(400).json({ success: false, message: "Order is already canceled" });
      }

      // Update TrangThai to 4 (canceled)
      const cancelOrderQuery = `UPDATE PHIEUDAT SET TrangThai = 4 WHERE MaPD = @MaPD;`;
      await transaction.request()
        .input('MaPD', sql.Int, orderId)
        .query(cancelOrderQuery);

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json({ success: true, message: "Order canceled successfully" });
    } catch (error) {
      // Rollback the transaction if there's an error
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ success: false, message: "An error occurred while canceling the order" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getOrderById = async (req, res) => {

    const orderId = req.params.orderId;
    const userId = auth.getUserIdFromToken(req);
    try {
      const query = `
        SELECT pd.*, ctpd.SoLuong, ctpd.DonGia,
        GIW.TenDH, GIW.HinhAnh
        FROM PHIEUDAT pd
        INNER JOIN CTPHIEUDAT ctpd ON pd.MaPD = ctpd.MaPD
        INNER JOIN GetInfoWatches GIW ON ctpd.MaDH = GIW.MaDH
        WHERE pd.MaPD = @orderId
      `;
      
      const result = await pool.request().input('orderId', sql.Int, orderId).query(query);
    const orderDetails = result.recordset;

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (userId && userId !== orderDetails[0].MaKH) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const formattedOrderDetails = {
      MaPD: orderDetails[0].MaPD,
      NgayDat: orderDetails[0].NgayDat,
      HoNN: orderDetails[0].HoNN,
      TenNN: orderDetails[0].TenNN,
      DiaChiNN: orderDetails[0].DiaChiNN,
      SDT: orderDetails[0].SDT,
      NgayGiao: orderDetails[0].NgayGiao,
      TrangThai: orderDetails[0].TrangThai,
      MaKH: orderDetails[0].MaKH,
      MaNVDuyet: orderDetails[0].MaNVDuyet,
      MaNVGiao: orderDetails[0].MaNVGiao,
      MaGiaoDich: orderDetails[0].MaGiaoDich,
      ChiTietPD: orderDetails.map(item => ({
        SoLuong: item.SoLuong,
        DonGia: item.DonGia,
        TenDH: item.TenDH,
        HinhAnh: item.HinhAnh,
      })),
    };

    return res.status(200).json({ success: true, orderDetails: formattedOrderDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
const getOrdersByCustomerId = async (req, res) => {
  const userId = auth.getUserIdFromToken(req);

  try {
    // Check if the user is authenticated
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Query to get order details from PHIEUDAT and CTPHIEUDAT tables
    const query = `
      SELECT pd.*, ctpd.SoLuong, ctpd.DonGia,
      GIW.TenDH, GIW.HinhAnh
      FROM PHIEUDAT pd
      INNER JOIN CTPHIEUDAT ctpd ON pd.MaPD = ctpd.MaPD
      INNER JOIN DONGHO DH ON ctpd.MaDH = DH.MaDH
      INNER JOIN GetInfoWatches GIW ON ctpd.MaDH = GIW.MaDH
      WHERE pd.MaKH = @userId
      ORDER BY pd.NgayDat DESC; -- Order by NgayDat in descending order
    `;

    // Execute the query with userId as input parameter
    const result = await pool.request().input('userId', sql.Int, userId).query(query);
    const orders = result.recordset;

    // Check if orders are found for the authenticated user
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "Orders not found for this user" });
    }

    // Format the orders into a more readable response
    const formattedOrders = [];

    // Loop through the orders to group them based on MaPD
    orders.forEach(order => {
      const existingOrder = formattedOrders.find(item => item.MaPD === order.MaPD);

      if (existingOrder) {
        // If the order with the same MaPD exists, push the ChiTietPD to its array
        existingOrder.ChiTietPD.push({
          SoLuong: order.SoLuong,
          DonGia: order.DonGia,
          TenDH: order.TenDH,
          HinhAnh: order.HinhAnh,
        });
      } else {
        // If the order with MaPD doesn't exist, create a new order entry
        formattedOrders.push({
          MaPD: order.MaPD,
          NgayDat: order.NgayDat,
          DiaChiNN: order.DiaChiNN,
          TrangThai: order.TrangThai,
          ChiTietPD: [{
            SoLuong: order.SoLuong,
            DonGia: order.DonGia,
            TenDH: order.TenDH,
            HinhAnh: order.HinhAnh,
          }],
        });
      }
    });

    // Return the formatted orders as a response
    return res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
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
