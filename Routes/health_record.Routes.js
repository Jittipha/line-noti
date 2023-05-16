const healthRecordController = require("../Controllers/Health_record.Controller");
const express = require("express")
const router  = express.Router();


router.get('/get/health/last/record/:id',healthRecordController.get_bmi_pressure_last_record);
router.post('/get/health/nearby/date',healthRecordController.get_health_nearby_date);
router.post('/get/health/history',healthRecordController.get_health_history);


module.exports = router;