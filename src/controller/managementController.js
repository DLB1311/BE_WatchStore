const upload = require('../middleware/multer');
const jwt = require('jsonwebtoken');
const pool = require('../config/SQLManager');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const validator = require('validator');
const auth = require('../middleware/auth');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const ManagementDAO = require('../dao/ManagementDAO');
const managementDAO = new ManagementDAO();

const getBookingOrders = async (req, res) => {
    try {
        // Call the function from ManagementDAO to get booking orders
        const bookingOrders = await managementDAO.getBookingOrders();

        return res.status(200).json({
            success: true,
            bookingOrders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getBookingOrderDetails = async (req, res) => {
    try {
        const { maPD } = req.params;
        if (!maPD || maPD.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_BOOKING_ORDER_CODE });
        }

        // Call the function from ManagementDAO to get booking order details
        const bookingOrderData = await managementDAO.getBookingOrderDetails(maPD);

        if (!bookingOrderData) {
            return res.status(404).json({ success: false, message: process.env.BOOKING_ORDER_NOT_FOUND });
        }

        // Send the booking order data as the response
        return res.status(200).json({
            success: true,
            bookingOrderData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const updateOrderStatusAndAssignEmployee = async (req, res) => {
    try {
        const { maPD } = req.params;
        const { maNVGiao } = req.body;

        const userId = auth.getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: process.env.UNAUTHORIZED });
        }

        if (!maPD || maPD.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_BOOKING_ORDER_CODE });
        }

        if (!maNVGiao || maNVGiao.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_EMPLOYEE_ID });
        }

        // Call the DAO function to update order status and assign an employee
        await managementDAO.updateOrderStatusAndAssignEmployee(maPD, userId, maNVGiao);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Order status updated and employee assigned successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const completeOrder = async (req, res) => {
    try {
        const maNVGiao = auth.getUserIdFromToken(req); // Get the delivery employee ID from the token
        const { maPD } = req.params;

        if (!maPD || maPD.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_BOOKING_ORDER_CODE });
        }

        // Call the DAO function to complete the order
        await managementDAO.completeOrder(maPD, maNVGiao);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Order completed successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { maPD } = req.params;
        const { MaHoaDon, MaSoThue, HoTen } = req.body;
        const userId = auth.getUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: process.env.UNAUTHORIZED });
        }

        if (!maPD || maPD.trim() === '' || !MaSoThue || !HoTen) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        // Call the function from ManagementDAO to create an invoice
        const result = await managementDAO.createInvoice(maPD, MaHoaDon, MaSoThue, HoTen, userId);

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: process.env.BOOKING_ORDER_NOT_FOUND_OR_CANNOT_BE_INVOICED,
            });
        }

        if (result === 'duplicate') {
            return res.status(409).json({
                success: false,
                message: 'Invoice already exists for the booking order or duplicate MaHoaDon',
            });
        }

        // ... Your existing code to generate and save the PDF ...

        // Return success response
        return res.status(201).json({
            success: true,
            message: process.env.INVOICE_CREATED_SUCCESSFULLY,
            data: invoiceResponse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getInvoice = async (req, res) => {
    try {
        const { maPD } = req.params;

        // Call the function from ManagementDAO to get invoice details
        const invoiceResponse = await managementDAO.getInvoice(maPD);

        if (invoiceResponse === null) {
            return res.status(404).json({
                success: false,
                message: process.env.INVOICE_NOT_FOUND_FOR_THE_BOOKING_ORDER,
            });
        }

        return res.status(200).json({
            success: true,
            message: process.env.INVOICE_DETAILS_FETCHED_SUCCESSFULLY,
            data: invoiceResponse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getRevenueReports = async (req, res) => {
    try {
        const fromDate = req.query.fromDate; // Get the fromDate from the request query
        const toDate = req.query.toDate; // Get the toDate from the request query
        console.log(fromDate);
        console.log(toDate);

        // Call the function from ManagementDAO to get revenue reports
        const revenueReports = await managementDAO.getRevenueReports(fromDate, toDate);

        return res.status(200).json({
            success: true,
            revenueReports,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getAllDiscounts = async (req, res) => {
    try {
        const discountList = await managementDAO.getAllDiscounts();

        return res.status(200).json({
            success: true,
            discountList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.ERROR_RETRIEVING_DISCOUNT_LIST });
    }
};

const createDiscount = async (req, res) => {
    try {
        const userId = auth.getUserIdFromToken(req);
        const { TenDotKM, NgayBatDau, NgayKetThuc, MoTa } = req.body;

        // Validate input data
        if (!TenDotKM || !NgayBatDau || !NgayKetThuc || !userId) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        await managementDAO.createDiscount({
            TenDotKM,
            NgayBatDau,
            NgayKetThuc,
            MoTa,
            MaNV: userId,
        });

        return res.status(201).json({
            success: true,
            message: process.env.DISCOUNT_CREATED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const updateDiscount = async (req, res) => {
    try {
        const userId = auth.getUserIdFromToken(req);
        const { MaDotKM, TenDotKM, NgayBatDau, NgayKetThuc, MoTa } = req.body;

        // Validate input data
        if (!MaDotKM || !TenDotKM || !NgayBatDau || !NgayKetThuc || !userId) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        await managementDAO.updateDiscount({
            MaDotKM,
            TenDotKM,
            NgayBatDau,
            NgayKetThuc,
            MoTa,
            MaNV: userId,
        });

        return res.status(200).json({
            success: true,
            message: process.env.DISCOUNT_UPDATED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const deleteDiscount = async (req, res) => {
    try {
        const { MaDotKM } = req.params;

        // Validate input data
        if (!MaDotKM) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        await managementDAO.deleteDiscount(MaDotKM);

        return res.status(200).json({
            success: true,
            message: process.env.DISCOUNT_DELETED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.PROMOTION_DETAILS_AVAILABLE });
    }
};

const getDiscountDetails = async (req, res) => {
    try {
        const { MaDotKM } = req.params;

        if (!MaDotKM || MaDotKM.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_DISCOUNT_CODE });
        }

        const discount = await managementDAO.getDiscountDetails(MaDotKM);

        if (!discount) {
            return res.status(404).json({ success: false, message: process.env.DISCOUNT_NOT_FOUND });
        }

        return res.status(200).json({
            success: true,
            discount,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getWatchesWithoutDiscounts = async (req, res) => {
    try {
        const { MaDotKM } = req.params; // Assuming you're passing the MaDotKM as a parameter

        const watchesWithoutDiscounts = await managementDAO.getWatchesWithoutDiscounts(MaDotKM);

        return res.status(200).json({
            success: true,
            watchesWithoutDiscounts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const addDiscountDetails = async (req, res) => {
    try {
        // Extract data from the request body
        const { MaDotKM, MaDH, GiamGia } = req.body;

        // Validate input data
        if (!MaDotKM || !MaDH || !GiamGia) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        // Call the DAO function to add discount details
        await managementDAO.addDiscountDetails(MaDotKM, MaDH, GiamGia);

        return res.status(201).json({
            success: true,
            message: 'Discount details added successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const updateDiscountPercentage = async (req, res) => {
    try {
        const { MaDotKM, MaDH, PhanTramGiam } = req.body;

        // Validate input data
        if (!MaDotKM || !MaDH || !PhanTramGiam) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        // Call the DAO function to update discount percentage
        await managementDAO.updateDiscountPercentage(MaDotKM, MaDH, PhanTramGiam);

        return res.status(200).json({
            success: true,
            message: 'Discount percentage updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const deleteDiscountDetail = async (req, res) => {
    try {
        const { MaDotKM, MaDH } = req.body;

        // Validate input data
        if (!MaDotKM || !MaDH) {
            return res.status(400).json({ success: false, message: process.env.INVALID_DATA });
        }

        // Call the DAO function to delete discount details
        await managementDAO.deleteDiscountDetail(MaDotKM, MaDH);

        return res.status(200).json({
            success: true,
            message: 'Discount details deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getDeliveryStaffBookingOrders = async (req, res) => {
    try {
        const maNVGiao = auth.getUserIdFromToken(req);

        if (!maNVGiao || maNVGiao.trim() === '') {
            return res.status(400).json({ success: false, message: process.env.INVALID_EMPLOYEE_ID });
        }

        const bookingOrders = await managementDAO.getDeliveryStaffBookingOrders(maNVGiao);

        return res.status(200).json({
            success: true,
            bookingOrders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: process.env.AN_ERROR_OCCURRED });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        // Call the DAO function to get all suppliers
        const suppliers = await managementDAO.getAllSuppliers();

        res.status(200).json({
            success: true,
            suppliers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: process.env.AN_ERROR_OCCURRED_WHILE_FETCHING_SUPPLIERS,
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
                message: process.env.ALL_FIELDS_ARE_REQUIRED,
            });
        }

        // Call the DAO function to add the supplier
        await managementDAO.addSupplier(MaNCC, TenNCC, DiaChi, Email, SDT);

        res.status(201).json({
            success: true,
            message: process.env.SUPPLIER_ADDED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: process.env.AN_ERROR_OCCURRED_WHILE_ADDING_THE_SUPPLIER,
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
                message: process.env.ALL_FIELDS_ARE_REQUIRED,
            });
        }

        // Call the DAO function to edit the supplier
        await managementDAO.editSupplier(supplierId, TenNCC, DiaChi, Email, SDT);

        res.status(200).json({
            success: true,
            message: process.env.SUPPLIER_UPDATED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: process.env.AN_ERROR_OCCURRED_WHILE_UPDATING_THE_SUPPLIER,
        });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplierId = req.params.supplierId;

        // Implement any necessary validation checks for the input data

        // Call the DAO function to delete the supplier
        await managementDAO.deleteSupplier(supplierId);

        res.status(200).json({
            success: true,
            message: process.env.SUPPLIER_DELETED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: process.env.AN_ERROR_OCCURRED_WHILE_DELETING_THE_SUPPLIER,
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
    deleteSupplier,
};