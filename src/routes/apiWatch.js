const express = require('express');
const watchController = require('../controller/watchController');
const auth = require("../middleware/auth");

let Router = express.Router()


Router.get('/getBestSellingWatches' , watchController.getBestSellingWatches);
Router.get('/getNewWatches' , watchController.getNewWatches);
Router.get('/getWatchesWithHighestDiscount' , watchController.getWatchesWithHighestDiscount);
Router.get('/getWatchByMaDH/:MaDH' , watchController.getWatchByMaDH);

Router.get('/search' , watchController.searchWatches);
Router.get('/getWatchesByBrandAndType' , watchController.getWatchesByBrandAndType);

Router.get('/getAllBrands', watchController.getAllBrands);
Router.post('/addBrand',auth.authVerifyTokenStaff, watchController.addBrand);
Router.put('/updateBrand/:brandId',auth.authVerifyTokenStaff, watchController.updateBrand);
Router.delete('/deleteBrand/:brandId',auth.authVerifyTokenStaff, watchController.deleteBrand);

Router.get('/getAllTypes', watchController.getAllTypes);
Router.post('/addType',auth.authVerifyTokenStaff, watchController.addType);
Router.put('/updateType/:typeId',auth.authVerifyTokenStaff, watchController.updateType);
Router.delete('/deleteType/:typeId',auth.authVerifyTokenStaff, watchController.deleteType);


Router.get('/getAllWatches', watchController.getAllWatches);
Router.post('/addWatch',auth.authVerifyTokenStaff, watchController.addWatch);
Router.put('/updateWatch',auth.authVerifyTokenStaff, watchController.updateWatch);
Router.delete('/deleteWatch/:MaDH',auth.authVerifyTokenStaff, watchController.deleteWatch);
Router.get('/getWatchPriceHistory/:MaDH', auth.authVerifyTokenStaff, watchController.getWatchPriceHistory);
Router.post('/addPriceChange',auth.authVerifyTokenStaff, watchController.addPriceChange);
Router.put('/editPriceChange',auth.authVerifyTokenStaff, watchController.editPriceChange);
Router.delete('/deletePriceChange',auth.authVerifyTokenStaff, watchController.deletePriceChange);


Router.get("/getRandomWatchesByBrand/:brandId", watchController.getRandomWatchesByBrand);

module.exports = Router 