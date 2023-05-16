const userController = require("../Controllers/user.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',userController.getAll);
router.get('/get/by/department/:id',userController.getByDepart);
router.post('/getdata/doc/schedule',userController.getDocScheduleAndMyAppoint);
router.post('/getdata/doc/period',userController.get_period);
router.post('/adddata',userController.adddata);
router.patch('/updatedata',userController.updatedata);
router.delete('/delete/:id',userController.deleteOne);

module.exports =router;