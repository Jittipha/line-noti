const xrayResultController = require("../Controllers/xray_result.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',xrayResultController.getAll);
router.post('/adddata',xrayResultController.adddata);
router.put('/updatedata',xrayResultController.updatedata);
router.delete('/delete/:id',xrayResultController.deleteOne);

module.exports =router;