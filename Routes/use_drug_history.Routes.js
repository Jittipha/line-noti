const useDrugHistoryController = require("../Controllers/use_drug_history.Controller");
const express = require("express")
const router  = express.Router();


router.get('/get/patient/health/:id',useDrugHistoryController.get_patient_health);
router.post('/getall/drug',useDrugHistoryController.getAll_Drug);
router.post('/get/by/drug',useDrugHistoryController.getByDrug);
router.post('/get/patient/allergies',useDrugHistoryController.get_patient_allergies);




module.exports =router;