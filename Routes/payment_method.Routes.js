const paymentMethodController = require("../Controllers/payment_method.Controller");
const paymenMethodValidate = require('../Validators/payment_method.Validator')
const validator = require('../Middleware/validator')
const express = require("express")
const router  = express.Router();



router.get('/getall',paymentMethodController.getAll);
router.post('/adddata',paymenMethodValidate.checkBody_createPaymentMethod,validator,paymentMethodController.adddata);
router.patch('/updatedata',paymenMethodValidate.checkBody_updatePaymentMethod,validator,paymentMethodController.updatedata);
router.delete('/delete/:id',paymentMethodController.deleteOne);

module.exports =router;