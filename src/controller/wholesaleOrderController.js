const WholesaleOrderDAO = require('../dao/WholesaleOrderDAO');
const wholesaleOrderDAO = new WholesaleOrderDAO();
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


const getAllOrders = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getAllOrder();
        res.status(200).json({ success: true, orders });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001});

    }
};

const getOrdersBySupplierId = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getAllOrderBySupplierId(req.params);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message:process.env.ERROR_E001 });
    }
};

const getOrderDetailByOrderId = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getDetailOrdersByOrderId(req.params);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }
};

const getOrdersWithoutReceive = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getOrdersWithoutReceive();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001});
    }
};

const addOrder = async (req, res) => {
    const staffId = auth.getUserIdFromToken(req);
    const {supplierId, orderId  } = req.body;
    

    try {
        await wholesaleOrderDAO.addOrder(supplierId , orderId , staffId);

        res.status(200).json({ success: true, message: process.env.ADD_WHOLESALEORDER_SUCCESS});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001});
    }
};


const updateOrder = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.UPPDATE_WHOLESALEORDER_ERROR });

        await wholesaleOrderDAO.updateOrder(req.params, req.body);
        res.status(200).json({ success: true, message: process.env.UPPDATE_WHOLESALEORDER_SUCCESS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }

};

const deleteOrder = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.DEL_WHOLESALEORDER_ERROR1 });

        const checkDetailNote = await wholesaleOrderDAO.getDetailOrdersByOrderId(req.params);
        if (checkDetailNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.DEL_WHOLESALEORDER_ERROR2 });

        await wholesaleOrderDAO.deleteOrder(req.params);
        res.status(200).json({ success: true, message: process.env.DEL_WHOLESALEORDER_SUCCESS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }
};

const addOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.ADD_WHOLESALEORDERDETAIL_ERROR});

        await wholesaleOrderDAO.addDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: process.env.ADD_WHOLESALEORDERDETAIL_SUCCESS});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001});
    }
};

const updateOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.UPDATE_WHOLESALEORDERDETAIL_ERROR });

        await wholesaleOrderDAO.updateDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: process.env.UPDATE_WHOLESALEORDERDETAIL_SUCCESS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }
};

const deleteOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: process.env.UPDATE_WHOLESALEORDERDETAIL_ERROR});

        await wholesaleOrderDAO.deleteDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: process.env.DEL_WHOLESALEORDERDETAIL_SUCCESS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: process.env.ERROR_E001 });
    }
};

module.exports = {
    getAllOrders,
    getOrdersBySupplierId,
    getOrderDetailByOrderId,
    getOrdersWithoutReceive,
    addOrder,
    updateOrder,
    deleteOrder,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
};