const { param,body } = require("express-validator");

exports.checkBody_createPaymentMethod = [
    body('methodName','is required').notEmpty(),
    body('imagePath','is required').notEmpty(),
   
]



exports.checkBody_updatePaymentMethod =[
    body('_id','is required').notEmpty(),
   
]







