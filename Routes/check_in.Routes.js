const checkInController = require("../Controllers/check_in.Controller");
const express = require("express")
const router  = express.Router();


router.get('/getall/queue',checkInController.getdata_queue);
router.get('/get/queue/by/id/:id',checkInController.getdata_queue_by_id);
router.get('/get/queue/card/:id',checkInController.get_queue_card);
router.get('/get/queue/list/by/queueid/:id',checkInController.getdata_queue_list);
router.get('/check/appoint/:PATIENT_ID/:DATE',checkInController.check_appoint);
router.post('/add/queue',checkInController.add_queue);
router.delete('/delete/queue',checkInController.delete_queue);

module.exports = router;