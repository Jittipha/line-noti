const telemedController = require("../Controllers/telemed.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',telemedController.getAll);
router.get('/get/list/:id',telemedController.getList);
router.post('/adddata',telemedController.adddata);
router.patch('/updatedata',telemedController.updatedata);
router.delete('/delete/:id',telemedController.deleteOne);

module.exports =router;