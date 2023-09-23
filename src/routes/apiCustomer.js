const express = require('express');
const customerController = require('../controller/customerController');
const auth = require("../middleware/auth");
const moment = require('moment');

let Router = express.Router()

Router.post('/signIn' , customerController.signIn);
Router.post('/signUp' , customerController.signUp);
Router.get('/getCusProfile' , customerController.getCusProfile);
Router.put('/updateProfile' , customerController.updateProfile);
Router.put('/updatePassword' , customerController.updatePassword);

Router.post('/placeOrder' , customerController.placeOrder);
Router.post('/cancelOrder' , customerController.cancelOrder);

Router.get('/getOrderById/:orderId' , customerController.getOrderById);

Router.get('/getOrdersByCustomerId' , customerController.getOrdersByCustomerId);



module.exports = Router 