const mainPersonalController = require("../Controllers/patient.Controller");
const auth = require('../Middleware/auth')
const express = require("express")
const router  = express.Router();



router.get('/getall',mainPersonalController.getAll);
router.post('/adddata',mainPersonalController.adddata);
router.patch('/updatedata',mainPersonalController.updatedata);
router.delete('/delete/:id',mainPersonalController.deleteOne);

module.exports =router;