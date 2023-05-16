const reportTypeController = require("../Controllers/report_type.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',reportTypeController.getAll);
router.get('/getall/dropdown',reportTypeController.getAll_dropdown);
router.post('/adddata',reportTypeController.adddata);
router.patch('/updatedata',reportTypeController.updatedata);
router.delete('/delete/:id',reportTypeController.deleteOne);

module.exports =router;