const rightController = require("../Controllers/right.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',rightController.getAll);
router.post('/adddata',rightController.adddata);
router.post('/updatedata',rightController.updatedata);
router.delete('/delete/:id',rightController.deleteOne);

module.exports =router;