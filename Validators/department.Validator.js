const { param,body } = require("express-validator");

exports.checkBody_createDepartment = [
    body('departmentName','is required').notEmpty(),
   
]

exports.checkBody_updateDepartment = [
    body('_id','is required').notEmpty(),
    body('departmentName','is required').notEmpty(),
   
]