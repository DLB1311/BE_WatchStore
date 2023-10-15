const express = require('express');
const rnController = require('../controller/receivedNoteController');
const auth = require("../middleware/auth");

let Router = express.Router();

//1. Lấy danh sách tất cả các phiếu nhập hàng
Router.get('/getAllNotes', auth.authVerifyTokenStaff, rnController.getAllNotes);

//2. Lấy danh sách các phiếu nhập hàng theo nhà cung cấp, nhận mã ncc trong request params
//{ supplierId } = req.params
Router.get('/getNoteBySupplierId/:supplierId', auth.authVerifyTokenStaff, rnController.getNoteBySupplierId);

//3. Lấy danh sách chi tiết của 1 phiếu nhập hàng theo mapn, nhận mapn trong request params
//{ noteId } = req.params
Router.get('/getDetailNotesByNoteId/:noteId', auth.authVerifyTokenStaff, rnController.getDetailNotesByNoteId);

//Thêm phiếu nhập + ctpn + update stock theo maddh, nhận maddh trong request params, mapn + manv trong request body
//{orderId} = req.params // { noteId, staffId } = req.body
Router.post('/addNote/:orderId', auth.authVerifyTokenStaff, rnController.addNote);

//Xóa phiếu nhập + ctpn + update stock theo mapn, nhận mapn trong request params
//{noteId} = req.params
Router.delete('/deleteNote/:noteId', auth.authVerifyTokenStaff, rnController.deleteNote);

module.exports = Router;

/*
- Phải tạo phiếu nhập dựa trên 1 đơn đặt hàng có sẵn
- Khi tạo phiếu nhập, phải cập nhật số lượng tồn của đồng hồ theo chi tiết phiếu nhập
- Không cho thay đổi thông tin chi tiết phiếu nhập, nếu muốn thì xóa phiếu nhập đó, và thay đổi thông tin 
    trong đơn đặt hàng liên quan
- Khi xóa phiếu nhập thì phải cập nhật lại số lượng tồn cho các đồng hồ được nhập. Nếu có bất kì số lượng
    tồn nào bé hơn số lượng của nó trong chi tiết phiếu nhập thì failed
- Phiếu nhập và chi tiết phiếu nhập chỉ được tạo hoặc xóa, không được chỉnh sửa
- Muốn tạo phiếu và chi tiết thì chỉ cần mã đơn đặt hàng
*/

/*
- Trang đơn phiếu nhập có 2 danh sách - danh sách phiếu nhập ở trên + ds chi tiết phiếu nhập ở dưới tương ứng vs
    phiếu nhập được chọn ở trên
- Có 1 nút thêm phiếu ở trên cùng bên phải, bấm nào hiện ra modal hiện ds các đơn đặt hàng chưa nhập
- Có lọc ds theo nhà cung cấp bên trái nút thêm
- Mỗi phiếu nhập trong ds có nút 3 chấm, cho xóa phiếu nhập
*/