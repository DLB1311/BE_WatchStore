
const routerWatch = require('./apiWatch')
const routerCustomer = require('./apiCustomer')
const routerPayment = require('./apiPayment')
const routerStaff = require('./apiStaff')
const apiManagement = require('./apiManagement')
const apiReceivedNote = require('./apiReceivedNote')
const apiWholesaleOrder = require('./apiWholesaleOrder')

function initAPIRoute(app) {

    app.use('/api/v1/watch', routerWatch)
    app.use('/api/v1/customer', routerCustomer)
    app.use('/api/v1/staff', routerStaff)
    app.use('/api/v1/payment', routerPayment)
    app.use('/api/v1/management', apiManagement)
    app.use('/api/v1/wholesale_order', apiWholesaleOrder)
    app.use('/api/v1/received_note', apiReceivedNote)

}


module.exports = initAPIRoute;