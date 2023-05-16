const paymentCardController = require("../Controllers/payment_card.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',paymentCardController.getAll);
router.get('/get/by/id/:id',paymentCardController.getbyID);
router.post('/adddata',paymentCardController.adddata);
router.patch('/updatedata',paymentCardController.updatedata);
router.delete('/delete/:id',paymentCardController.deleteOne);

module.exports =router;