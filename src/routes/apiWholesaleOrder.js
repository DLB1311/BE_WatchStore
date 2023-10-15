const express = require('express');
const woController = require('../controller/wholesaleOrderController');
const auth = require("../middleware/auth");

let Router = express.Router();

//Trả về những đơn chưa nhập hàng lên trước, kết quả có thêm field "received" để hiển thị các đơn hàng chưa nhập
//0: chưa nhập, 1: đã nhập
Router.get('/getAllOrders', auth.authVerifyTokenStaff, woController.getAllOrders);

//{spplierId} = req.params
Router.get('/getOrdersBySupplierId/:supplierId', auth.authVerifyTokenStaff, woController.getOrdersBySupplierId);

//{orderId} = req.params
Router.get('/getOrderDetailByOrderId/:orderId', auth.authVerifyTokenStaff, woController.getOrderDetailByOrderId);

//Trả về tất cả các đơn hàng chưa có phiếu nhập 
Router.get('/getOrdersWithoutReceive', auth.authVerifyTokenStaff, woController.getOrdersWithoutReceive);

Router.post('/addOrder', auth.authVerifyTokenStaff, woController.addOrder);

//{orderId} = req.params // { supplierId, staffId, orderId } = req.body
Router.put('/updateOrder/:orderId', auth.authVerifyTokenStaff, woController.updateOrder);

//{orderId} = req.params
Router.delete('/deleteOrder/:orderId', auth.authVerifyTokenStaff, woController.deleteOrder);

//{orderId} = req.params // { watchId, quantity, price } = reqBody
Router.post('/addOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.addOrderDetail);

//{orderId} = req.params // { watchId, quantity, price } = reqBody
Router.put('/updateOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.updateOrderDetail);

//{orderId} = req.params
Router.delete('/deleteOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.deleteOrderDetail);

module.exports = Router;

/*
- Muốn thay đổi thông tin chi tiết đặt hàng, phải xóa phiếu nhập và chi tiết phiếu nhập liên quan
- Chỉ được thay đổi số lượng và đơn giá của chi tiết đặt hàng
*/