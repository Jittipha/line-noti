const symptonController = require("../Controllers/sympton.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',symptonController.getAll);
router.get('/getall/dropdown',symptonController.getAll_dropdown);
router.post('/adddata',symptonController.adddata);
router.patch('/updatedata',symptonController.updatedata);
router.delete('/delete/:id',symptonController.deleteOne);

module.exports =router;