const pushNotification = require("../Controllers/push-notification.Controller");
const express = require("express")
const router  = express.Router();


router.get('/getall',pushNotification.getAll);
router.get('/get/count/status/read/:id',pushNotification.getcount_unread);
router.get('/update/status/read/:id',pushNotification.update_status_read);
router.get('/get/noti/list/by/patient/:id',pushNotification.get_notification_list_by_patient);
router.post('/send',pushNotification.sendPushNotifitication);
router.post('/send/specific/time',pushNotification.sendPushNotifitication_specific_time);
router.delete('/delete/:id',pushNotification.delete_notification_api);


module.exports = router;