const docExtraController = require("../Controllers/docExtra.Controller");
const express = require("express")
const router  = express.Router();



router.get('/getall',docExtraController.getAll);
router.post('/adddata',docExtraController.adddata);
router.patch('/updatedata',docExtraController.updatedata);
router.delete('/delete/:id',docExtraController.deleteOne);

module.exports =router;