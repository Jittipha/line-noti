const { param,body } = require("express-validator");

exports.checkBody_verify =[
    body('phone','is required').notEmpty(),
    body('phone','is limit length 10 characters').isLength({min : 10,msx: 10}),
    body('otp','is required').notEmpty(),
    body('otp','is limit length 6 characters').isLength({min : 6,msx: 6}),
    body('hash','is required').notEmpty(),
    body('ref','is required').notEmpty(),
]







