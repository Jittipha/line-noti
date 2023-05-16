const cancelReasonController = require("../Controllers/cancel_reson.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',cancelReasonController.getAll);
router.get('/getall/dropdown',cancelReasonController.getAll_dropdown);
router.post('/adddata',cancelReasonController.adddata);
router.patch('/updatedata',cancelReasonController.updatedata);
router.delete('/delete/:id',cancelReasonController.deleteOne);

module.exports =router;