const appointmentController = require("../Controllers/appointment.Controller");
const appointmentValidator = require('../Validators/appointment.Validator')
const validator = require('../Middleware/validator')
const cache = require("../Middleware/cache")
const upload = require("../Middleware/upload");
const express = require("express")
const router  = express.Router();

router.get('/getall',appointmentController.getAll);
router.get('/getmyappointment/:id',appointmentController.get_myappointment);
router.get('/getbyid/:id',appointmentController.getByID);
router.post('/adddata',upload.single("file"),appointmentController.adddata);
router.patch('/updatedata',appointmentValidator.checkBody_updateAppointment,validator,appointmentController.updatedata);
router.delete('/delete/:id',appointmentController.deleteOne);
router.delete('/cancel/appoint',appointmentController.Cancel_Appoint);

module.exports = router;