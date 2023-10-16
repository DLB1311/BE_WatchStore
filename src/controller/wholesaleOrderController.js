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
        res.status(500).json({ success: false, message: "An error occurred" });

    }
};

const getOrdersBySupplierId = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getAllOrderBySupplierId(req.params);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const getOrderDetailByOrderId = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getDetailOrdersByOrderId(req.params);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const getOrdersWithoutReceive = async (req, res) => {
    try {
        const orders = await wholesaleOrderDAO.getOrdersWithoutReceive();

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const addOrder = async (req, res) => {
    const staffId = auth.getUserIdFromToken(req);
    const {supplierId, orderId  } = req.body;
    

    try {
        await wholesaleOrderDAO.addOrder(supplierId , orderId , staffId);

        res.status(200).json({ success: true, message: "A wholesale order has been added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};


const updateOrder = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: "There is a received note link to this order!" });

        await wholesaleOrderDAO.updateOrder(req.params, req.body);
        res.status(200).json({ success: true, message: "Wholesale order has been updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }

};

const deleteOrder = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: "There is a received note link to this order!" });

        const checkDetailNote = await wholesaleOrderDAO.getDetailOrdersByOrderId(req.params);
        if (checkDetailNote.length > 0)
            return res.status(400).json({ success: false, message: "There is at least one detail order link to this order!" });

        await wholesaleOrderDAO.deleteOrder(req.params);
        res.status(200).json({ success: true, message: "Wholesale order has been removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const addOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: "There is a received note link to this order!" });

        await wholesaleOrderDAO.addDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: "A detail order has been added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const updateOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: "There is a received note link to this order!" });

        await wholesaleOrderDAO.updateDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: "A detail order has been updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const deleteOrderDetail = async (req, res) => {
    try {
        const checkReceivedNote = await wholesaleOrderDAO.checkReceivedNoteExisted(req.params);
        if (checkReceivedNote.length > 0)
            return res.status(400).json({ success: false, message: "There is a received note link to this order!" });

        await wholesaleOrderDAO.deleteDetailOrder(req.params, req.body);
        return res.status(200).json({ success: true, message: "A detail order has been removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred" });
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