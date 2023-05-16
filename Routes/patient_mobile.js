const personalController = require("../Controllers/patient_mobile.Controller");
const cache = require("../Middleware/cache")
const personalValidate = require('../Validators/personal.Validator')
const validator = require('../Middleware/validator')
const upload = require("../Middleware/upload");
const express = require("express")
const router  = express.Router();
const auth = require('../Middleware/auth')


router.get('/getall',personalController.getAll);
router.get('/get/profile/:id',auth.verifyToken,personalController.Get_Profile);
router.get('/getbyid/:id',personalController.getByID);
router.get('/get/upcoming/booking/:id',personalController.GetUpcoming_Booking);
router.get('/check/already/:identificationNumber',personalController.Checkalready);
router.get('/cancal/line/:id',personalController.cancelLine);
router.post('/add/image',upload.single("file"),personalController.Upload_Image);
router.post('/update/data',personalController.updatedata);
// router.post('/check/login',personalValidate.checkBody_login,validator,personalController.Checklogin);
router.post('/check/login',personalController.Checklogin);
router.post('/check/phone',personalValidate.checkBody_CheckPhoneNumber,validator,personalController.CheckPhoneNumber);
router.post('/check/emailandblood',personalController.CheckEmailAndBloodtype);
router.post('/adddata',personalController.adddata);
router.post('/getall/myappoint/month',personalController.getAllMyappoint_inMonth);
router.post('/getall/myappoint/date',personalController.getAllMyappoint_inDate);
router.post('/update/password',personalValidate.checkBody_resetPassword,validator,personalController.resetPassword);
router.post('/change/password',personalValidate.checkBody_ChangePassword,validator,personalController.change_password);
router.patch('/update/data',personalController.updatedata);
router.patch('/update/main/data',personalController.update_main_data);
router.delete('/delete/:id',personalController.deleteOne);
router.delete('/logout',personalController.logout);


module.exports =router;