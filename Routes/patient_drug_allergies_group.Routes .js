const patientDrugAllergiesGroupController = require("../Controllers/patient_drug_allergies_group.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',patientDrugAllergiesGroupController.getAll);
router.post('/adddata',patientDrugAllergiesGroupController.adddata);
router.patch('/updatedata',patientDrugAllergiesGroupController.updatedata);
router.delete('/delete/:id',patientDrugAllergiesGroupController.deleteOne);

module.exports =router;