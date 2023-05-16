const { param,body } = require("express-validator");

exports.checkBody_createPayment = [
    body('visitNo','is required').notEmpty(),
    body('receiptNumber','is required').notEmpty(),
    body('qrcodeNumber','is required').notEmpty(),
    body('dateofIssue','is required').notEmpty(),
    body('personalID','is required').notEmpty(),
    body('statusID','is required').notEmpty(),
]


exports.checkBody_updatePayment =[
    body('_id','is required').notEmpty(),
]











