const paymentController = require("../Controllers/payment.Controller");
const paymentValidator = require('../Validators/payment.Validator')
const validator = require('../Middleware/validator')
const express = require("express")
const router  = express.Router();

router.get('/get/by/order/:id',paymentController.getByOrderID);
router.post('/get/by/patient',paymentController.getByPatient);
router.post('/update/paid',paymentController.update_paid);
router.post('/update/data',paymentController.update_data);

module.exports = router;