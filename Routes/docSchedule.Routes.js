const docScheduleController = require("../Controllers/docSchedule.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',docScheduleController.getAll);
router.post('/adddata',docScheduleController.adddata);
router.patch('/updatedata',docScheduleController.updatedata);
router.delete('/delete/:id',docScheduleController.deleteOne);

module.exports =router;