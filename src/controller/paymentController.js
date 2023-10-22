const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/SQLManager");
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require("../middleware/auth");

const dotenv = require("dotenv");
dotenv.config();

const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox', // or 'live' for production
  client_id: 'AQ-onrxHsHghhKtOFjzFeJju350GtGK-guFIXyqguSaeqyiPMJf1AzGnYHcIyl-J6YYNf275CHQtsLSH',
  client_secret: 'EJtt9EYhIxACuv7aJBlUpiDfbGshrG_FdezMp7zM9-rAU-Ck3dDVR8AyJ2k4YQn2JjKUjcJpFk5LHVoV',
});


const saveTransactionNumber = async (req, res) => {

  try {
    const { transactionNo, orderId } = req.body;

    const parsedOrderId = parseInt(orderId, 10); // Parse orderId as an integer

    if (isNaN(parsedOrderId)) {
      return res.status(400).json({ success: false, message: process.env.PAYMENT_E001 });
    }

    const maPD = parsedOrderId; 
    const updateStatusQuery = `UPDATE PHIEUDAT SET TrangThai = 1, MaGiaoDich = @MaGiaoDich WHERE MaPD = @MaPD;`;

    // Update the status in PHIEUDAT table
    await pool.request()
      .input('MaPD', sql.Int, maPD)
      .input('MaGiaoDich', sql.NVarChar(50), transactionNo)
      .query(updateStatusQuery);

    // Retrieve details from CTPHIEUDAT for the given order
    const getDetailsQuery = `SELECT MaDH, SoLuong FROM CTPHIEUDAT WHERE MaPD = @MaPD2;`; // Use a different parameter name for the second query
    const detailsResult = await pool.request().input('MaPD2', sql.Int, maPD).query(getDetailsQuery);

    // Update inventory in DONGHO table for each product in the order
    for (const row of detailsResult.recordset) {
      const { MaDH, SoLuong } = row;
      const updateInventoryQuery = `UPDATE DONGHO SET SoLuongTon = SoLuongTon - @SoLuong WHERE MaDH = @MaDH;`;

      await pool.request()
        .input('MaDH', sql.NVarChar(10), MaDH)
        .input('SoLuong', sql.Int, SoLuong)
        .query(updateInventoryQuery);
    }
    return res.status(200).json({ success: true, message: process.env.PAYMENT_SUCCESS});
  } catch (error) {
    console.error(error);

    return res.status(500).json({ success: false, message: process.env.ERROR_E001 });
  }
};

  

module.exports = {
 saveTransactionNumber,
};
