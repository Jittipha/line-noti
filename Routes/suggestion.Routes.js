const suggestionController = require("../Controllers/suggestion.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',suggestionController.getAll);
router.get('/get/by/patient/:id',suggestionController.getByPatient);
router.post('/adddata',suggestionController.adddata);
router.post('/updatedata',suggestionController.updatedata);
router.delete('/delete/:id',suggestionController.deleteOne);

module.exports =router;