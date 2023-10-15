const express = require('express');
const woController = require('../controller/wholesaleOrderController');
const auth = require("../middleware/auth");

let Router = express.Router();

//Trả về những đơn chưa nhập hàng lên trước, kết quả có thêm field "received" để hiển thị các đơn hàng chưa nhập
//0: chưa nhập, 1: đã nhập
Router.get('/getAllOrders', auth.authVerifyTokenStaff, woController.getAllOrders);

//1. Lấy danh sách các đơn đặt hàng theo nhà cung cấp, nhận mã ncc trong request params
//{spplierId} = req.params
Router.get('/getOrdersBySupplierId/:supplierId', auth.authVerifyTokenStaff, woController.getOrdersBySupplierId);

//2. Lấy danh sách chi tiết của 1 đơn đặt hàng theo maddh, nhận maddh trong request params
//{orderId} = req.params
Router.get('/getOrderDetailByOrderId/:orderId', auth.authVerifyTokenStaff, woController.getOrderDetailByOrderId);

//3. Trả về tất cả các đơn hàng chưa có phiếu nhập 
Router.get('/getOrdersWithoutReceive', auth.authVerifyTokenStaff, woController.getOrdersWithoutReceive);

//4. Thêm đơn đặt hàng; nhận mancc, manv, maddh trong request body
//{ supplierId, staffId, orderId } = req.body
Router.post('/addOrder', auth.authVerifyTokenStaff, woController.addOrder);

//5. Cập nhật đơn đặt hàng; nhận maddh trong request params, nhận ngày tạo đơn, mancc, manv trong request body
//{orderId} = req.params // { orderDate, supplierId, staffId } = req.body
Router.put('/updateOrder/:orderId', auth.authVerifyTokenStaff, woController.updateOrder);

//6. Xóa đơn đặt hàng theo maddh, không thể xóa nếu có ctddh liên quan, nhận maddh trong request params
//{orderId} = req.params
Router.delete('/deleteOrder/:orderId', auth.authVerifyTokenStaff, woController.deleteOrder);

//7. Thêm chi tiết đơn đặt hàng, nhận maddh trong request params, nhận madh, soluong, dongia trong request body
//{orderId} = req.params // { watchId, quantity, price } = reqBody
Router.post('/addOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.addOrderDetail);

//8. Cập nhật chi tiết đơn đặt hàng, nhận maddh trong request params, nhận madh, soluong, dongia trong request body
//{orderId} = req.params // { watchId, quantity, price } = reqBody
Router.put('/updateOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.updateOrderDetail);

//9. Xóa chi tiết ddh, nhận maddh trong request params, nhận madh trong request body
//{orderId} = req.params // { watchId } = req.body
Router.delete('/deleteOrderDetail/:orderId', auth.authVerifyTokenStaff, woController.deleteOrderDetail);

module.exports = Router;

/*Tất cả thay đổi trên ddh + ctddh, trừ thêm mới ddh đều không thể thực hiện nếu đã có phiếu nhập */

/*
- Muốn thay đổi thông tin chi tiết đặt hàng, phải xóa phiếu nhập và chi tiết phiếu nhập liên quan
- Chỉ được thay đổi số lượng và đơn giá của chi tiết đặt hàng
*/

/*
- Trang đơn đặt hàng có 2 danh sách - danh sách đơn đặt hàng ở trên + ds chi tiết ddh ở dưới tương ứng vs
    đơn đặt hàng được chọn ở trên
- Có 1 nút thêm đơn đặt hàng ở trên cùng bên phải, bấm nào hiện ra modal để nhập thông tin đơn đặt hàng mới
- Trong ds đơn đặt hàng, mỗi đặt hàng thể hiện đầy đủ thông tin + trạng thái đã nhập hàng chưa + nút 3 chấm
    có 3 lựa chọn (sửa, xóa, tạo phiếu nhập đối với đơn chưa nhập)
- Hiện ds đơn đặt hàng chưa có phiếu nhập lên đầu
- Bên cạnh ds ctddh có nút thêm chi tiết ddh mới, bấm chọn ra modal, mỗi dòng chi tiết có nút 3 chấm có
    2 lựa chọn là xóa và sửa, không cho xóa sửa nếu ddh đã có phiếu nhập
*/