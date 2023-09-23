
const routerWatch = require('./apiWatch')
const routerCustomer = require('./apiCustomer')
const routerPayment = require('./apiPayment')
const routerStaff = require('./apiStaff')
const apiManagement = require('./apiManagement')

function initAPIRoute(app) {

    app.use('/api/v1/watch', routerWatch)
    app.use('/api/v1/customer', routerCustomer)
    app.use('/api/v1/staff', routerStaff)
    app.use('/api/v1/payment', routerPayment)
    app.use('/api/v1/management', apiManagement)

}


module.exports = initAPIRoute;