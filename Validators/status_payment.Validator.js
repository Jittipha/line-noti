const { param,body } = require("express-validator");

exports.checkBody_createStatusPayment = [
    body('statusName','is required').notEmpty(),
   
]



exports.checkBody_updateStatusPayment =[
    body('_id','is required').notEmpty(),
   
]







