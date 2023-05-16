const { param,body } = require("express-validator");

exports.checkBody_createAppointment = [
    body('appointmentTime','is required').notEmpty(),
    body('appointmentDate','is required').notEmpty(),
    body('personalID','is required').notEmpty(),
    body('doctorID','is required').notEmpty(),
    body('departmentName','is required').notEmpty(),
    body('prefix','is required').notEmpty(),
    body('firstName','is required').notEmpty(),
    body('lastName','is required').notEmpty(),
]



exports.checkBody_updateAppointment =[
    body('_id','is required').notEmpty(),
]







