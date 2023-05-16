const BuildingController = require("../Controllers/building.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',BuildingController.getAll);
router.post('/adddata',BuildingController.adddata);
router.post('/updatedata',BuildingController.updatedata);
router.delete('/delete/:id',BuildingController.deleteOne);

module.exports =router;