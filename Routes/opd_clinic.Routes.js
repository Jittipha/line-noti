const opdClinicController = require("../Controllers/opd_clinic.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',opdClinicController.getAll);
router.post('/adddata',opdClinicController.adddata);
router.patch('/updatedata',opdClinicController.updatedata);
router.delete('/delete/:id',opdClinicController.deleteOne);

module.exports =router;