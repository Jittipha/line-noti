const getServiceController = require("../Controllers/get_service.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',getServiceController.getAll);
router.get('/get/by/type/:servicetype',getServiceController.get_by_type);
router.post('/adddata',getServiceController.adddata);
router.post('/updatedata',getServiceController.updatedata);
router.delete('/delete/:id',getServiceController.deleteOne);

module.exports =router;