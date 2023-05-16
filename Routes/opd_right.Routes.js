const opd_rightController = require("../Controllers/opd_right.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',opd_rightController.getAll);
router.post('/adddata',opd_rightController.adddata);
router.post('/updatedata',opd_rightController.updatedata);
router.delete('/delete/:id',opd_rightController.deleteOne);

module.exports =router;