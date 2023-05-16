const statusPaymentController = require("../Controllers/status_payment.Controller");
const statusPaymentValidate = require('../Validators/status_payment.Validator')
const validator = require('../Middleware/validator')
const express = require("express")
const router  = express.Router();



router.get('/getall',statusPaymentController.getAll);
router.post('/adddata',statusPaymentValidate.checkBody_createStatusPayment,validator,statusPaymentController.adddata);
router.patch('/updatedata',statusPaymentValidate.checkBody_updateStatusPayment,validator,statusPaymentController.updatedata);
router.delete('/delete/:id',statusPaymentController.deleteOne);

module.exports =router;