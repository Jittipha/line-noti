const patientHealthController = require("../Controllers/patient_health.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',patientHealthController.getAll);
router.post('/adddata',patientHealthController.adddata);
router.patch('/updatedata',patientHealthController.updatedata);
router.delete('/delete/:id',patientHealthController.deleteOne);

module.exports =router;