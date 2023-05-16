const otpController = require("../Controllers/otp.Controller");
const otpValidator = require('../Validators/payment.Validator')
const validator = require('../Middleware/validator')
const express = require("express")
const router  = express.Router();

router.get('/create/:phone',otpController.CreateOTP);
router.post('/verify',otpController.verifyOTP);

module.exports = router;