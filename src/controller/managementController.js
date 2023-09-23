const upload = require("../middleware/multer");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const validator = require("validator");
const auth = require("../middleware/auth");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();


let getBookingOrders = async (req, res) => {
  try {
    // If statuses are not provided or an empty array, query all booking orders from the database
    query = "SELECT * FROM PHIEUDAT ORDER BY NGAYDAT DESC";
    result = await pool.request().query(query);
    const bookingOrders = result.recordset;
    // Send the booking orders as the response
    return res.status(200).json({
      success: true,  
      bookingOrders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

let getBookingOrderDetails = async (req, res) => {
  try {
    const { maPD } = req.params; 
    if (!maPD || maPD.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking order code" });
    }

    // Query the booking order and its details (CTPHIEUDAT) using the booking order code (MaPD)
    const query = `
      SELECT PD.*, CT.*, DH.HinhAnh, DH.TenDH, HD.MaHD as MaHD, 
        NV.Ho + ' ' + NV.Ten as TenNVGiao, 
        NV_Duyet.Ho + ' ' + NV_Duyet.Ten as TenNVDuyet
      FROM PHIEUDAT AS PD
      INNER JOIN CTPHIEUDAT AS CT ON PD.MaPD = CT.MaPD
      INNER JOIN DONGHO AS DH ON CT.MaDH = DH.MaDH
      LEFT JOIN HOADON AS HD ON PD.MaPD = HD.MaPD
      LEFT JOIN NHANVIEN AS NV ON PD.MaNVGiao = NV.MaNV
      LEFT JOIN NHANVIEN AS NV_Duyet ON PD.MaNVDuyet = NV_Duyet.MaNV
      WHERE PD.MaPD = @maPD;
    `;

    const result = await pool
      .request()
      .input("maPD", sql.Int, maPD)
      .query(query);
    const rows = result.recordset;

    // Check if any data was found for the given booking order code
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking order not found" });
    }

    const bookingOrderData = {
      MaPD: rows[0].MaPD[0],
      NgayDat: rows[0].NgayDat,
      HoNN: rows[0].HoNN,
      TenNN: rows[0].TenNN,
      DiaChiNN: rows[0].DiaChiNN,
      SDT: rows[0].SDT,
      MaGiaoDich: rows[0].MaGiaoDich,
      NgayGiao: rows[0].NgayGiao,
      TrangThai: rows[0].TrangThai,
      MaKH: rows[0].MaKH,
      MaNVDuyet: rows[0].MaNVDuyet,
      TenNVDuyet: rows[0].TenNVDuyet, // Name of the staff who approved the order
      MaNVGiao: rows[0].MaNVGiao,
      TenNVGiao: rows[0].TenNVGiao, // Name of the delivery staff
      ChiTietDat: [],
      MaHD: rows[0].MaHD || null,
    };

    // Iterate through the rows and populate the ChiTietDat array
    rows.forEach((row) => {
      const chiTietDat = {
        MaCT: row.MaCT,
        SoLuong: row.SoLuong,
        DonGia: row.DonGia,
        SoLuongTra: row.SoLuongTra,
        MaPT: row.MaPT,
        TenDH: row.TenDH,
        HinhAnh: row.HinhAnh,
      };
      bookingOrderData.ChiTietDat.push(chiTietDat);
    });

    // Send the booking order data as the response
    return res.status(200).json({
      success: true,
      bookingOrderData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};
let updateOrderStatusAndAssignEmployee = async (req, res) => {
  try {
    const { maPD } = req.params;
    const { maNVGiao } = req.body;

    const userId = auth.getUserIdFromToken(req);
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!maPD || maPD.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking order code" });
    }

    if (!maNVGiao || maNVGiao.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    const updateOrderStatusQuery = `
      UPDATE PHIEUDAT
      SET TrangThai = 2, MaNVDuyet = @userId, MaNVGiao = @maNVGiao
      WHERE MaPD = @maPD AND TrangThai = 1;
    `;

    await pool
      .request()
      .input("userId", sql.NChar, userId)
      .input("maPD", sql.Int, maPD)
      .input("maNVGiao", sql.NChar, maNVGiao)
      .query(updateOrderStatusQuery);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Order status updated and employee assigned successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};
let completeOrder = async (req, res) => {
  try {
    const maNVGiao = auth.getUserIdFromToken(req); // Get the delivery employee ID from the token
    const { maPD } = req.params;
    const ngayGiao = new Date(); // Use the current date as the delivery date

    if (!maPD || maPD.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid booking order code" });
    }

    // Check if the order status is 2 (which means it's ready for completion)
    const checkOrderStatusQuery = `
      SELECT TrangThai FROM PHIEUDAT WHERE MaPD = @maPD;
    `;
    const result = await pool
      .request()
      .input("maPD", sql.NVarChar, maPD)
      .query(checkOrderStatusQuery);

    if (result.recordset.length === 0 || result.recordset[0].TrangThai !== 2) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status for completion" });
    }

    const updateOrderQuery = `
      UPDATE PHIEUDAT
      SET NgayGiao = @ngayGiao, MaNVGiao = @maNVGiao , Trangthai=3
      WHERE MaPD = @maPD;
    `;

    await pool
      .request()
      .input("maPD", sql.NVarChar, maPD)
      .input("ngayGiao", sql.Date, ngayGiao)
      .input("maNVGiao", sql.NVarChar, maNVGiao)
      .query(updateOrderQuery);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Order completed successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

let createInvoice = async (req, res) => {
  try {
    const { maPD } = req.params;
    const {MaHoaDon, MaSoThue, HoTen } = req.body;
    const userId = auth.getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!maPD || maPD.trim() === "" || !MaSoThue || !HoTen) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const checkBookingOrderQuery = `
      SELECT *
      FROM PHIEUDAT
      WHERE MaPD = @maPD AND TrangThai = 2;
    `;

    const result = await pool
      .request()
      .input("maPD", sql.Int, maPD)
      .query(checkBookingOrderQuery);
    const bookingOrder = result.recordset[0];

    if (!bookingOrder) {
      return res.status(404).json({
        success: false,
        message: "Booking order not found or cannot be invoiced",
      });
    }

    const checkInvoiceExistsQuery = `
  SELECT *
  FROM HOADON
  WHERE MaPD = @maPD OR MaHD = @maHD;
`;

const checkInvoiceResult = await pool
  .request()
  .input("maPD", sql.Int, maPD)
  .input("maHD", sql.NVarChar, MaHoaDon)
  .query(checkInvoiceExistsQuery);

const existingInvoice = checkInvoiceResult.recordset[0];

if (existingInvoice) {
  return res.status(409).json({
    success: false,
    message: "Invoice already exists for the booking order or duplicate MaHoaDon",
  });
}

    // Create the new invoice (hóa đơn) in the HOADON table
    const createInvoiceQuery = `
      INSERT INTO HOADON (MaHD, NgayTaoHD, MaSoThue, HoTen, MaNV, MaPD)
      VALUES (@maHD, GETDATE(), @MaSoThue, @HoTen, @maNV, @maPD);
    `;
    await pool
      .request()
      .input("maHD", sql.NVarChar, MaHoaDon)
      .input("MaSoThue", sql.NVarChar, MaSoThue)
      .input("HoTen", sql.NVarChar, HoTen)
      .input("maNV", sql.NVarChar, userId)
      .input("maPD", sql.Int, maPD)
      .query(createInvoiceQuery);

    // Generate and save the PDF
    const getOrderDetailsQuery = `
      SELECT pd.MaPD, dh.TenDH, ctpd.SoLuong, ctpd.DonGia, ctpd.SoLuong * ctpd.DonGia AS TongTien
      FROM CTPHIEUDAT ctpd
      JOIN DONGHO dh ON ctpd.MaDH = dh.MaDH
      JOIN PHIEUDAT pd ON ctpd.MaPD = pd.MaPD
      WHERE pd.MaPD = @maPD;
    `;
    const orderDetailsResult = await pool
      .request()
      .input("maPD", sql.Int, maPD)
      .query(getOrderDetailsQuery);
    const orderDetails = orderDetailsResult.recordset;

    const getEmployeeNameQuery = `
    SELECT Ho + ' ' +Ten as TenNV FROM NHANVIEN WHERE MaNV = @maNV;
  `;
  const employeeResult = await pool
    .request()
    .input("maNV", sql.NVarChar, userId)
    .query(getEmployeeNameQuery);
  const employeeName = employeeResult.recordset[0].TenNV;

    // Calculate the total amount
    const totalAmount = orderDetails.reduce(
      (acc, order) => acc + parseFloat(order.TongTien),
      0
    );
    const invoiceResponse = {
      MaHD:MaHoaDon, 
      MaSoThue,
      HoTen,
      TenNV: employeeName,
      MaPD: maPD,
      NgayTaoHD: new Date().toISOString(), 
      ChiTietPhieuDat: orderDetails.map((order) => ({
        MaPD: order.MaPD,
        TenDH: order.TenDH,
        SoLuong: order.SoLuong,
        DonGia: order.DonGia,
        Amount: order.TongTien,
      })),
      TongTien: totalAmount,
    };

    // ... Your existing code to return the response ...
    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoiceResponse,
    });

  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

let getInvoice = async (req, res) => {
  try {
    const { maPD } = req.params;
    const userId = auth.getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const getInvoiceQuery = `
      SELECT hd.MaHD, hd.NgayTaoHD, hd.MaSoThue, hd.HoTen, nv.Ho + ' ' + nv.Ten as TenNV
      FROM HOADON hd
      JOIN NHANVIEN nv ON hd.MaNV = nv.MaNV
      WHERE hd.MaPD = @maPD;
    `;

    const result = await pool
      .request()
      .input('maPD', sql.Int, maPD)
      .query(getInvoiceQuery);
    const invoice = result.recordset[0];

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for the booking order',
      });
    }

    const getInvoiceDetailsQuery = `
      SELECT dh.TenDH, ctpd.SoLuong, ctpd.DonGia, ctpd.SoLuong * ctpd.DonGia AS TongTien
      FROM CTPHIEUDAT ctpd
      JOIN DONGHO dh ON ctpd.MaDH = dh.MaDH
      WHERE ctpd.MaPD = @maPD;
    `;
    const invoiceDetailsResult = await pool
      .request()
      .input('maPD', sql.Int, maPD)
      .query(getInvoiceDetailsQuery);
    const invoiceDetails = invoiceDetailsResult.recordset;

    const totalAmount = invoiceDetails.reduce(
      (acc, detail) => acc + parseFloat(detail.TongTien),
      0
    );

    const invoiceResponse = {
      ...invoice,
      MaPD: maPD,
      ChiTietPhieuDat: invoiceDetails.map((detail) => ({
        TenDH: detail.TenDH,
        SoLuong: detail.SoLuong,
        DonGia: detail.DonGia,
        Amount: detail.TongTien,
      })),
      TongTien: totalAmount,
    };

    return res.status(200).json({
      success: true,
      message: 'Invoice details fetched successfully',
      data: invoiceResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

let getRevenueReports = async (req, res) => {
  try {
    const fromDate = req.query.fromDate; // Get the fromDate from the request query
    const toDate = req.query.toDate; // Get the toDate from the request query
    console.log(fromDate)
    console.log(toDate)
    const result = await pool.request()
      .input('FromDate', sql.NVarChar(25), fromDate)
      .input('ToDate', sql.NVarChar(25), toDate)
      .execute('sp_ThongKeDonDatHang');

    const revenueReports = result.recordset;
    // Send the revenue reports as the response
    return res.status(200).json({
      success: true,
      revenueReports,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

const getAllDiscounts= async (req, res) => {
  try {
    const query = `
    SELECT * FROM DOTKHUYENMAI
    `;

    const result = await pool.request().query(query);
    const data = result.recordset;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error retrieving staff list" });
  }
};

let createDiscount = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);
    const { TenDotKM, NgayBatDau, NgayKetThuc, MoTa } = req.body;

    // Validate input data
    if (!TenDotKM || !NgayBatDau || !NgayKetThuc || !userId) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Check if the new discount overlaps with existing discounts
    const overlapQuery = `
      SELECT COUNT(*) AS OverlapCount
      FROM DOTKHUYENMAI
      WHERE (NgayBatDau <= @NgayKetThuc) AND (NgayKetThuc >= @NgayBatDau);
    `;

    const overlapResult = await pool
      .request()
      .input("NgayBatDau", sql.Date, NgayBatDau)
      .input("NgayKetThuc", sql.Date, NgayKetThuc)
      .query(overlapQuery);

    const overlapCount = overlapResult.recordset[0].OverlapCount;

    if (overlapCount > 0) {
      return res.status(400).json({
        success: false,
        message: "The new discount overlaps with existing discounts",
      });
    }

    // If no overlap, insert the new discount
    const insertQuery = `
      INSERT INTO DOTKHUYENMAI (TenDotKM, NgayBatDau, NgayKetThuc, MoTa, MaNV)
      VALUES (@TenDotKM, @NgayBatDau, @NgayKetThuc, @MoTa, @MaNV);
    `;

    await pool
      .request()
      .input("TenDotKM", sql.NVarChar, TenDotKM)
      .input("NgayBatDau", sql.Date, NgayBatDau)
      .input("NgayKetThuc", sql.Date, NgayKetThuc)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("MaNV", sql.NVarChar, userId)
      .query(insertQuery);

    return res.status(201).json({
      success: true,
      message: "Discount created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};
let updateDiscount = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);
    const { MaDotKM, TenDotKM, NgayBatDau, NgayKetThuc, MoTa } = req.body;

    // Validate input data
    if (!MaDotKM || !TenDotKM || !NgayBatDau || !NgayKetThuc || !userId) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Check if the updated discount overlaps with existing discounts
    const overlapQuery = `
      SELECT COUNT(*) AS OverlapCount
      FROM DOTKHUYENMAI
      WHERE MaDotKM <> @MaDotKM
        AND ((NgayBatDau <= @NgayKetThuc AND NgayKetThuc >= @NgayBatDau)
          OR (NgayKetThuc >= @NgayBatDau AND NgayBatDau <= @NgayKetThuc));
    `;

    const overlapResult = await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .input("NgayBatDau", sql.Date, NgayBatDau)
      .input("NgayKetThuc", sql.Date, NgayKetThuc)
      .query(overlapQuery);

    const overlapCount = overlapResult.recordset[0].OverlapCount;

    if (overlapCount > 0) {
      return res.status(400).json({
        success: false,
        message: "The updated discount overlaps with existing discounts",
      });
    }

    // If no overlap, update the discount
    const updateQuery = `
      UPDATE DOTKHUYENMAI
      SET TenDotKM = @TenDotKM, NgayBatDau = @NgayBatDau, NgayKetThuc = @NgayKetThuc, MoTa = @MoTa, MaNV = @MaNV
      WHERE MaDotKM = @MaDotKM;
    `;

    await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .input("TenDotKM", sql.NVarChar, TenDotKM)
      .input("NgayBatDau", sql.Date, NgayBatDau)
      .input("NgayKetThuc", sql.Date, NgayKetThuc)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("MaNV", sql.NVarChar, userId)
      .query(updateQuery);

    return res.status(200).json({
      success: true,
      message: "Discount updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let deleteDiscount = async (req, res) => {
  try {
    const userId = auth.getUserIdFromToken(req);
    const { MaDotKM } = req.params;

    // Validate input data
    if (!MaDotKM || !userId) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const query = `
      DELETE FROM DOTKHUYENMAI
      WHERE MaDotKM = @MaDotKM;
    `;

    await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .query(query);

    return res.status(200).json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Promotion details available" });
  }
};

let getDiscountDetails = async (req, res) => {
  try {
    const { MaDotKM } = req.params;

    if (!MaDotKM || MaDotKM.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid discount code" });
    }

    const query = `
      SELECT CTKHUYENMAI.*,DONGHO.TenDh
      FROM CTKHUYENMAI
      join DONGHO on CTKHUYENMAI.MaDH = DONGHO.MaDH
      WHERE MaDotKM = @MaDotKM;
    `;

    const result = await pool
      .request()
      .input("MaDotKM", sql.NVarChar, MaDotKM)
      .query(query);
    const discount = result.recordset;

    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Discount not found" });
    }

    return res.status(200).json({
      success: true,
      discount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};

let getWatchesWithoutDiscounts = async (req, res) => {
  try {
    const { MaDotKM } = req.params; // Assuming you're passing the MaDotKM as a parameter

    const query = `
    SELECT DONGHO.*
    FROM DONGHO
    LEFT JOIN (
      SELECT DISTINCT MaDH
      FROM CTKHUYENMAI
      WHERE MaDotKM = @MaDotKM
    ) AS DiscountedWatches
    ON DONGHO.MaDH = DiscountedWatches.MaDH
    WHERE DiscountedWatches.MaDH IS NULL;
    `;

    const result = await pool.request().input("MaDotKM", sql.Int, MaDotKM).query(query);
    const watchesWithoutDiscounts = result.recordset;

    return res.status(200).json({
      success: true,
      watchesWithoutDiscounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};


let addDiscountDetails = async (req, res) => {
  try {
    // Extract data from the request body
    const { MaDotKM, MaDH, GiamGia } = req.body;

    // Validate input data
    if (!MaDotKM || !MaDH || !GiamGia) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Insert discount details into the CTKHUYENMAI table
    const query = `
      INSERT INTO CTKHUYENMAI (MaDotKM, MaDH, PhanTramGiam)
      VALUES (@MaDotKM, @MaDH, @PhanTramGiam);
    `;

    await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .input("MaDH", sql.NVarChar, MaDH)
      .input("PhanTramGiam", sql.Float, GiamGia)
      .query(query);

    return res.status(201).json({
      success: true,
      message: "Discount details added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let updateDiscountPercentage = async (req, res) => {
  try {
    const { MaDotKM, MaDH, PhanTramGiam } = req.body;

    // Validate input data
    if (!MaDotKM || !MaDH || !PhanTramGiam) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Update discount percentage in the CTKHUYENMAI table
    const query = `
      UPDATE CTKHUYENMAI
      SET PhanTramGiam = @PhanTramGiam
      WHERE MaDotKM = @MaDotKM AND MaDH = @MaDH;
    `;

    await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .input("MaDH", sql.NVarChar, MaDH)
      .input("PhanTramGiam", sql.Float, PhanTramGiam)
      .query(query);

    return res.status(200).json({
      success: true,
      message: "Discount percentage updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let deleteDiscountDetail = async (req, res) => {
  try {
    const { MaDotKM, MaDH } = req.body;

    // Validate input data
    if (!MaDotKM || !MaDH) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    // Delete discount details from the CTKHUYENMAI table
    const query = `
      DELETE FROM CTKHUYENMAI
      WHERE MaDotKM = @MaDotKM AND MaDH = @MaDH;
    `;

    await pool
      .request()
      .input("MaDotKM", sql.Int, MaDotKM)
      .input("MaDH", sql.NVarChar, MaDH)
      .query(query);

    return res.status(200).json({
      success: true,
      message: "Discount details deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "An error occurred" });
  }
};

let getDeliveryStaffBookingOrders = async (req, res) => {
  try {
    const maNVGiao = auth.getUserIdFromToken(req);

    if (!maNVGiao || maNVGiao.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    // Query booking orders for the specified delivery staff
    const query = `
    SELECT *
    FROM PHIEUDAT
    WHERE MaNVGiao = @maNVGiao
    ORDER BY 
      CASE WHEN TrangThai = 2 THEN 0 ELSE 1 END,  -- Orders with status 2 first
      NGAYDAT DESC;  
    `;

    const result = await pool
      .request()
      .input("maNVGiao", sql.NVarChar, maNVGiao)
      .query(query);
    
    const bookingOrders = result.recordset;

    // Send the booking orders as the response
    return res.status(200).json({
      success: true,
      bookingOrders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
};


const getAllSuppliers = async (req, res) => {
  try {
    const query = "SELECT * FROM NHACC";
    const result = await pool.request().query(query);

    
      res.status(200).json({
        success: true,
        suppliers: result.recordset,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching suppliers.",
    });
  }
};
const addSupplier = async (req, res) => {
  try {
    const { MaNCC, TenNCC, DiaChi, Email, SDT } = req.body;

    // Implement necessary validation checks for the input data
    if (!MaNCC || !TenNCC || !DiaChi || !Email || !SDT) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const insertQuery = `
      INSERT INTO NHACC (MaNCC, TenNCC, DiaChi, Email, SDT)
      VALUES (@MaNCC, @TenNCC, @DiaChi, @Email, @SDT);
    `;

    await pool.request()
      .input("MaNCC", sql.NVarChar(10), MaNCC)
      .input("TenNCC", sql.NVarChar(50), TenNCC)
      .input("DiaChi", sql.NVarChar(200), DiaChi)
      .input("Email", sql.NVarChar(50), Email)
      .input("SDT", sql.NVarChar(15), SDT)
      .query(insertQuery);

    res.status(201).json({
      success: true,
      message: "Supplier added successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the supplier.",
    });
  }
};

const editSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const { TenNCC, DiaChi, Email, SDT } = req.body;

    // Implement necessary validation checks for the input data
    if (!TenNCC || !DiaChi || !Email || !SDT) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const updateQuery = `
      UPDATE NHACC
      SET TenNCC = @TenNCC, DiaChi = @DiaChi, Email = @Email, SDT = @SDT
      WHERE MaNCC = @MaNCC;
    `;

    await pool.request()
      .input("MaNCC", sql.NVarChar(10), supplierId)
      .input("TenNCC", sql.NVarChar(50), TenNCC)
      .input("DiaChi", sql.NVarChar(200), DiaChi)
      .input("Email", sql.NVarChar(50), Email)
      .input("SDT", sql.NVarChar(15), SDT)
      .query(updateQuery);

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the supplier.",
    });
  }
};
const deleteSupplier = async (req, res) => {
  try {
      const supplierId = req.params.supplierId;

      // Implement any necessary validation checks for the input data

      const deleteQuery = `
          DELETE FROM NHACC
          WHERE MaNCC = @MaNCC;
      `;

      await pool.request()
          .input("MaNCC", sql.NVarChar(10), supplierId)
          .query(deleteQuery);

      res.status(200).json({
          success: true,
          message: "Supplier deleted successfully.",
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "An error occurred while deleting the supplier.",
      });
  }
};

module.exports = {
  getBookingOrders,
  getBookingOrderDetails,
  updateOrderStatusAndAssignEmployee,
  completeOrder,

  createInvoice,
  getInvoice,
  getRevenueReports,
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountDetails,
  getWatchesWithoutDiscounts,
  addDiscountDetails,
  updateDiscountPercentage,
  deleteDiscountDetail,
  getDeliveryStaffBookingOrders,
  getAllSuppliers,
  addSupplier,
  editSupplier,
  deleteSupplier
};
