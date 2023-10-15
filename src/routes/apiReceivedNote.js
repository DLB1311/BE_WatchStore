const express = require('express');
const rnController = require('../controller/receivedNoteController');
const auth = require("../middleware/auth");

let Router = express.Router();

Router.get('/getAllNotes', auth.authVerifyTokenStaff, rnController.getAllNotes);

//{ supplierId } = req.params
Router.get('/getNoteBySupplierId/:supplierId', auth.authVerifyTokenStaff, rnController.getNoteBySupplierId);

//{ noteId } = req.params
Router.get('/getDetailNotesByNoteId/:noteId', auth.authVerifyTokenStaff, rnController.getDetailNotesByNoteId);

//{orderId} = req.params // { noteId, staffId } = req.body
Router.post('/addNote/:orderId', auth.authVerifyTokenStaff, rnController.addNote);

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