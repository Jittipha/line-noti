const medicalHistoryController = require("../Controllers/medical_history.Controller");
const express = require("express")
const router  = express.Router();



router.get('/get/by/opdid/:id',medicalHistoryController.getByOPD_CLINIC_ID);
router.post('/get/by/patient',medicalHistoryController.getByPatient);
router.post('/get/by/date',medicalHistoryController.getByDate);

module.exports =router;