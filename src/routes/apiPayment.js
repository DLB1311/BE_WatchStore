// backend/routes/payment.js
const express = require('express');
const paymentRouter = express.Router();
const axios = require('axios');
const moment = require('moment');
const crypto = require("crypto");
const querystring = require('qs');
const paymentController =  require('../controller/paymentController');
const config = require('../config/default.json');
const tmnCode = config.vnp_TmnCode;
const secretKey = config.vnp_HashSecret;
const vnpUrl = config.vnp_Url;
const returnUrl = config.vnp_ReturnUrl;
const pool = require("../config/database");
const sql = require('mssql');
// ... (other routes and middlewares if any)
paymentRouter.put('/saveTransactionNumber',paymentController.saveTransactionNumber)

// Endpoint to create the payment URL

paymentRouter.post('/create_payment_url', async function (req, res) {
    try {
        const orderId = req.body.MaPD;
        const amount = req.body.amount * 100;
    
        // Check if orderId is a valid number
        if (isNaN(orderId)) {
          return res.status(400).json({ success: false, message: "Invalid orderId. It must be a valid number." });
        }
    
        // Get product details from CTPHIEUDAT for the given order
        const getProductDetailsQuery = `SELECT MaDH, SoLuong FROM CTPHIEUDAT WHERE MaPD = @MaPD;`;
        const productDetails = await pool.request().input('MaPD', sql.Int, orderId).query(getProductDetailsQuery);
    
        // Check inventory for each product in the order
        for (const product of productDetails.recordset) {
          const { MaDH, SoLuong } = product;
    
          // Retrieve current inventory from DONGHO table
          const getInventoryQuery = `SELECT SoLuongTon FROM DONGHO WHERE MaDH = @MaDH;`;
          const inventoryResult = await pool.request().input('MaDH', sql.NVarChar(10), MaDH).query(getInventoryQuery);
    
          // Check if the current inventory is sufficient for the order
          const currentInventory = inventoryResult.recordset[0].SoLuongTon;
          if (currentInventory < SoLuong) {
            return res.status(400).json({ success: false, message: `Insufficient inventory for product with ID ${MaDH}` });
          }
        }
    
        // Generate a unique createDate
        const createDate = moment().format('YYYYMMDDHHmmss');

        // Get client IP address
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        // VNPay parameters
        const vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: 'Thanh toan cho ma phieu dat: ' + orderId,
            vnp_OrderType: 'other',
            vnp_Amount: amount,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        // Sort and stringify VNPay parameters
        const sortedParams = sortObject(vnp_Params);
        const signData = querystring.stringify(sortedParams, { encode: false });

        // Create signature using secretKey
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;

        // Construct the VNPay URL
        const vnpUrlWithParams = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

        res.json({ url: vnpUrlWithParams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});




// Function to sort an object by keys
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = paymentRouter;
