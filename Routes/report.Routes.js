const reportController = require("../Controllers/report.Controller");
const upload = require("../Middleware/upload");
const express = require("express")
const router  = express.Router();



router.get('/getall',reportController.getAll);
router.get('/get/by/patient/:id',reportController.getByPatient);
router.post('/adddata',upload.single('file'),reportController.adddata);
router.post('/updatedata',reportController.updatedata);
router.delete('/delete/:id',reportController.deleteOne);

module.exports =router;