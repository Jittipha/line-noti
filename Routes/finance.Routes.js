const financeController = require("../Controllers/finance.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',financeController.getAll);
router.post('/adddata',financeController.adddata);
router.patch('/updatedata',financeController.updatedata);
router.delete('/delete/:id',financeController.deleteOne);

module.exports =router;