const labResultController = require("../Controllers/lab_result.Controller")
const express = require("express")
const router  = express.Router();



router.get('/getall',labResultController.getAll);
router.post('/adddata',labResultController.adddata);
router.put('/updatedata',labResultController.updatedata);
router.delete('/delete/:id',labResultController.deleteOne);

module.exports =router;