const medicalCertController = require("../Controllers/medical_cert.Controller");
const express = require("express")
const router  = express.Router();


router.post('/get/list/data',medicalCertController.get_list_data);


module.exports = router;