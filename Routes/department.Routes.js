const departmentController = require("../Controllers/department.Controller");
const departmentValidate = require('../Validators/department.Validator')
const validator = require('../Middleware/validator')
const express = require("express")
const router  = express.Router();



router.get('/getall',departmentController.getAll);
router.get('/getall/dropdown',departmentController.getAll_dropdown);
router.get('/getall/real/data',departmentController.getAll_real_data);
router.post('/adddata',departmentValidate.checkBody_createDepartment,validator,departmentController.adddata);
router.patch('/updatedata',departmentValidate.checkBody_updateDepartment,validator,departmentController.updatedata);
router.delete('/delete/:id',departmentController.deleteOne);

module.exports =router;