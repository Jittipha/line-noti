const patientDrugAllergiesController = require("../Controllers/patient_drug_allergies.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',patientDrugAllergiesController.getAll);
router.post('/adddata',patientDrugAllergiesController.adddata);
router.patch('/updatedata',patientDrugAllergiesController.updatedata);
router.delete('/delete/:id',patientDrugAllergiesController.deleteOne);

module.exports =router;