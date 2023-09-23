const express = require('express');
const staffController = require('../controller/staffController');
const auth = require("../middleware/auth");
const moment = require('moment');

let Router = express.Router()

Router.post('/signInAdmin' , staffController.signInAdmin);

Router.get('/getDeliveryEmployees', auth.authVerifyTokenStaff, staffController.getDeliveryEmployees);

Router.get('/getInfoStaffByToken', auth.authVerifyTokenStaff, staffController.getInfoStaffByToken);

Router.get('/getAllRoleStaff', auth.authVerifyTokenStaff, staffController.getAllRoleStaff);

Router.get('/getAllStaff', auth.authVerifyTokenStaff, staffController.getAllStaff);
Router.post('/addStaffMember', auth.authVerifyTokenStaff, staffController.addStaffMember);

Router.put("/updateStaffMember/:staffId", auth.authVerifyTokenStaff, staffController.updateStaffMember);
Router.delete("/deleteStaffMember/:staffId", auth.authVerifyTokenStaff, staffController.deleteStaffMember);

Router.put("/changeStaffPassword", auth.authVerifyTokenStaff, staffController.changeStaffPassword);

module.exports = Router 