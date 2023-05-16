const patientFoodAllergiesController = require("../Controllers/patient_food_allergies.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',patientFoodAllergiesController.getAll);
router.post('/adddata',patientFoodAllergiesController.adddata);
router.patch('/updatedata',patientFoodAllergiesController.updatedata);
router.delete('/delete/:id',patientFoodAllergiesController.deleteOne);

module.exports =router;