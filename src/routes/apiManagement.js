const express = require('express');
const managementController = require('../controller/managementController');
const auth = require("../middleware/auth");
const moment = require('moment');

let Router = express.Router()

Router.get('/getBookingOrders' ,auth.authVerifyTokenStaff ,managementController.getBookingOrders);
Router.get('/getBookingOrderDetails/:maPD'  ,auth.authVerifyTokenStaff, managementController.getBookingOrderDetails);
Router.post('/updateOrderStatusAndAssignEmployee/:maPD',auth.authVerifyTokenStaff, managementController.updateOrderStatusAndAssignEmployee);

Router.post('/completeOrder/:maPD',auth.authVerifyTokenShipper, managementController.completeOrder);

Router.post('/createInvoice/:maPD'  ,auth.authVerifyTokenStaff, managementController.createInvoice);
Router.get('/getInvoice/:maPD'  ,auth.authVerifyTokenStaff, managementController.getInvoice);

Router.get('/getRevenueReports'  ,auth.authVerifyTokenStaff, managementController.getRevenueReports);

Router.get('/getAllDiscounts'  ,auth.authVerifyTokenStaff, managementController.getAllDiscounts);
Router.post('/createDiscount'  ,auth.authVerifyTokenStaff, managementController.createDiscount);
Router.put('/updateDiscount'  ,auth.authVerifyTokenStaff, managementController.updateDiscount);
Router.delete('/deleteDiscount/:MaDotKM'  ,auth.authVerifyTokenStaff, managementController.deleteDiscount);

Router.get('/getDiscountDetails/:MaDotKM'  ,auth.authVerifyTokenStaff, managementController.getDiscountDetails);
Router.get('/getWatchesWithoutDiscounts/:MaDotKM'  ,auth.authVerifyTokenStaff, managementController.getWatchesWithoutDiscounts);

Router.post('/addDiscountDetails'  ,auth.authVerifyTokenStaff, managementController.addDiscountDetails);
Router.put('/updateDiscountPercentage'  ,auth.authVerifyTokenStaff, managementController.updateDiscountPercentage);
Router.delete('/deleteDiscountDetail'  ,auth.authVerifyTokenStaff, managementController.deleteDiscountDetail);

Router.get('/getDeliveryStaffBookingOrders'  ,auth.authVerifyTokenShipper, managementController.getDeliveryStaffBookingOrders);

Router.get('/getAllSuppliers'  ,auth.authVerifyTokenStaff, managementController.getAllSuppliers);
Router.post('/addSupplier'  ,auth.authVerifyTokenStaff, managementController.addSupplier);
Router.put('/editSupplier/:supplierId'  ,auth.authVerifyTokenStaff, managementController.editSupplier);
Router.delete('/deleteSupplier/:supplierId'  ,auth.authVerifyTokenStaff, managementController.deleteSupplier);

module.exports = Router 