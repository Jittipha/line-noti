const { param,body } = require("express-validator");

exports.checkBody_createPersonal = [
    body('prefix','is required').notEmpty(),
    body('firstName','is required').notEmpty(),
    body('lastName','is required').notEmpty(),
    body('password','is required').notEmpty(),
    body('password','need length greather than 8').isLength({ min: 8 }),
    body('gender','is required').notEmpty(),
    body('birthDate','is required').notEmpty(),
    body('connectLine','is required').notEmpty(),
    body('identificationNumber','is required').notEmpty(),
    body('identificationNumber','must ba a number ').isNumeric(), 
    body('identificationNumber','is length 13 characters').isLength({ min: 13, max: 13 }),
    body('phone','is required').notEmpty(),
    body('phone','must ba a number ').isNumeric(), 
    body('phone','is limit length 10 characters').isLength({ min: 10, max: 10 }),
    body('statusID','is required').notEmpty(),
    
]



exports.checkBody_CheckPhoneNumber = [
    body('PATIENT_ID','is required').notEmpty(),
    body('phone','is required').notEmpty(), 
    body('phone','must ba a number ').isNumeric(), 
    body('phone','is length 10 characters').isLength({ min: 10, max: 10 }),
]



exports.checkBody_login = [
    body('identificationNumber','is required').notEmpty(),
    body('identificationNumber','must ba a number ').isNumeric(), 
    body('identificationNumber','is  length 13 characters').isLength({ min: 13, max: 13 }),
    body('password','is required').notEmpty(), 
    body('password','need length greather than 8').isLength({ min: 8 }),
]

exports.checkBody_resetPassword = [
    body('_id','is required').notEmpty(),
    body('password','is required').notEmpty(), 
]

exports.checkBody_ChangePassword = [
    body('_id','is required').notEmpty(),
    body('old_password','is required').notEmpty(), 
    body('new_password','is required').notEmpty(), 
]


exports.checkBody_updatePersonal =[
    body('_id','is required').notEmpty(),
]












