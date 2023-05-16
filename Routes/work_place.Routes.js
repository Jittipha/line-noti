const workPlaceController = require("../Controllers/work_place.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',workPlaceController.getAll);
router.post('/adddata',workPlaceController.adddata);
router.patch('/updatedata',workPlaceController.updatedata);
router.delete('/delete/:id',workPlaceController.deleteOne);

module.exports =router;