const admin = require("firebase-admin");
const notification = require("../models/notification");
const fcm = require("fcm-notification");
const schedule = require("node-schedule");
const patient_mobile = require("../models/patient_mobile");
const services = require("../services/General_services");
var serviceAccount = require("../config/push-notification-key.json");
const { ObjectID } = require("bson");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
const CronJob = require("cron").CronJob;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
exports.sendPushNotifitication = (req, res, next) => {
  const { token, message, date } = req.body;
  try {
    let message = {
      notification: {
        title: "Test Notification",
        body: "Notification Message",
      },
      data: {
        noti_id: "645a2260cc9e5aeddfacf1f3-3d",
      },
      token: token,
    };
    // admin.messaging().send(message)
    //     .then((response) => {
    //         console.log('Successfully sent message:', response);
    //     })
    //     .catch((error) => {
    //         console.error('Error sending message:', error);
    //     });
    FCM.send(message, function (err, resp) {
      if (err) {
        console.error("Error sending message");
      }
      console.log("Successfully sent message");
    });
    res.status(200).json({ message: "Notification scheduled" });
  } catch (err) {}
};

exports.sendPushNotifitication_specific_time = (req, res, next) => {
  let { title_message, body_message, date, id, PATIENT_ID } = req.body;
  try {
    let message = {
      notification: {
        title: title_message,
        body: body_message,
      },
    };
    this.specificDate(new Date(date), message, id, PATIENT_ID);
    res.status(200).send({
      message: "Notification Sent",
      data: { id: id },
    });
  } catch (err) {}
};
exports.specificDate = async (DateTime, message, noti_id, PATIENT_ID) => {
  // new CronJob('1,15,30,45 40 13 08 May *', function () {
  //     console.log('log')
  //     admin.messaging().send(message)
  //         .then((response) => {
  //             console.log('Successfully sent message:', response);
  //         })
  //         .catch((error) => {
  //             console.error('Error sending message:', error);
  //         });
  // }, null, true, 'Asia/Bangkok')
  message.data = { noti_id: noti_id };
  DateTime.setHours(DateTime.getHours() - 7);
  let date = {
    year: DateTime.getFullYear(),
    month: DateTime.getMonth(),
    day: DateTime.getDate(),
    hour: DateTime.getHours(),
    minute: DateTime.getMinutes(),
    second: DateTime.getSeconds(),
  };
  console.log(date)

  schedule.scheduleJob(
    `${noti_id}`, //Job name, prefered to be unique
    {
      tz: "Asia/Bangkok",
      year: date.year,
      month: date.month, // Months are zero-indexed, so 4 is May
      day: date.day,
      hour: date.hour,
      minute: date.minute,
      second: date.second,
    }, // 2020-05-02T12:52:00.000Z
    async () => {
      patient_mobile
        .findOne({ PATIENT_ID })
        .select("token_device logoutFlag")
        .exec(async (err, data) => {
          if (err) return console.log("err" + err);

          if (data.logoutFlag != "Y") {
            message.token = data.token_device;
            await admin
              .messaging()
              .send(message)
              .then(async (response) => {
                console.log("Successfully sent message:", response);
                const update_status_send = await notification.updateOne(
                  { noti_id: noti_id },
                  { status_send: "T" }
                );
              })
              .catch((error) => {
                console.error("Error sending message:", error);
              });
          } else {
            console.log("This patient logged out");
          }
        });
    }
  );
};

exports.delete_notification_api = async (req, res, next) => {
  let id = req.params.id;
  try {
    let respone = schedule.cancelJob(id);
    console.log("response delete " + respone);
    res.status(200).send({
      message: "deleted",
    });
  } catch (err) {}
};

exports.delete_notification = (noti_id) => {
  console.log(noti_id);
  try {
    let respone = schedule.cancelJob(noti_id);
    console.log("response delete " + respone);
  } catch (err) {
    console.log(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await notification.find();
    return res.send({ error: false, data: data });
  } catch (err) {
    return res.status(400);
  }
};

exports.getcount_unread = async (req, res) => {
  let PATIENT_ID = req.params.id;
  try {
    const data = await notification.countDocuments({
      PATIENT_ID,
      status_send: "T",
      status_read: "A",
    });
    return res.send({ error: false, data: data });
  } catch (err) {
    return res.status(400);
  }
};

exports.update_status_read = async (req, res) => {
  try {
    const noti_id = req.params.id;
    const data = await notification.findOne({ noti_id: noti_id });
    data.status_read = "R";
    await data.save();
    notification
      .aggregate([
        {
          $match: {
            $and: [{ noti_id: { $eq: noti_id } }],
          },
        },
        {
          $lookup: {
            from: "appoints",
            localField: "APPOINT_ID",
            foreignField: "_id",
            as: "APPOINT",
          },
        },
        {
          $unwind: "$APPOINT",
        },
        {
          $lookup: {
            from: "users",
            localField: "APPOINT.DOCTOR",
            foreignField: "_id",
            as: "DOCTOR",
          },
        },
        {
          $unwind: "$DOCTOR",
        },
        {
          $lookup: {
            from: "departments",
            localField: "APPOINT.DEPART_ID",
            foreignField: "_id",
            as: "DEPART",
          },
        },
        {
          $unwind: "$DEPART",
        },
        {
          $project: {
            APPOINT_ID: 0,
            createdAt: 0,
            updatedAt: 0,
            "DEPART.createdAt": 0,
            "DEPART.updatedAt": 0,
            "DEPART.__v": 0,
            "APPOINT.DEDART_ID": 0,
            "APPOINT.WORK_ID": 0,
            "APPOINT.DATE_CREATED": 0,
            "APPOINT.DATE_MODIFIED": 0,
            "APPOINT.__v": 0,
            "DOCTOR.DATE_CREATED": 0,
            "DOCTOR.DATE_MODIFIED": 0,
            "DOCTOR.__v": 0,
            __v: 0,
          },
        },
      ])
      .exec(async (err, data) => {
        if (err) return res.status(400).send(err);
        return res.send({ error: false, data: data[0] });
      });
  } catch (err) {
    return res.status(400);
  }
};

exports.get_notification_list_by_patient = async (req, res) => {
  let PATIENT_ID = req.params.id;
  try {
    notification
      .aggregate([
        {
          $match: {
            $and: [
              { PATIENT_ID: ObjectID(PATIENT_ID) },
              { status_send: { $eq: "T" } },
            ],
          },
        },
        {
          $lookup: {
            from: "appoints",
            localField: "APPOINT_ID",
            foreignField: "_id",
            as: "APPOINT",
          },
        },
        {
          $unwind: "$APPOINT",
        },
        {
          $lookup: {
            from: "departments",
            localField: "APPOINT.DEPART_ID",
            foreignField: "_id",
            as: "DEPART",
          },
        },
        {
          $unwind: "$DEPART",
        },
        {
          $project: {
            APPOINT_ID: 0,
            createdAt: 0,
            updatedAt: 0,
            "DEPART.createdAt": 0,
            "DEPART.updatedAt": 0,
            "DEPART.__v": 0,
            "APPOINT.DEDART_ID": 0,
            "APPOINT.WORK_ID": 0,
            "APPOINT.DATE_CREATED": 0,
            "APPOINT.DATE_MODIFIED": 0,
            "APPOINT.__v": 0,
            __v: 0,
          },
        },
        {
          $sort: {
            datetime_noti: -1,
          },
        },
      ])
      .exec(async (err, data) => {
        if (err) return res.status(400).send(err);
        return res.send({ error: false, data: data });
      });
  } catch (err) {
    return res.status(400);
  }
};

// module.exports = {
//     specificDate
// };

// exports.sendPushNotifitication =async (req, res, next) => {
//     const { token, message, date } = req.body;

//   // Create a Date object from the specified date and time
//   const sendDate = new Date(date);
//   console.log(sendDate)

//   // Schedule a Cloud Function to send the notification at the specified date and time
//   const functionName = 'sendScheduledNotification';
//   const functionOptions = { timeZone: 'Asia/Bangkok' };
//   const functionPayload = { token, message };

//   let message_for_send = {
//                 notification: {
//                     title: "Test Notification",
//                     body: "Notification Message"
//                 },
//                 data: {
//                     orderId: "123456",
//                     orderDate: "2022-10-28"
//                 },
//                 token: token
//             }

//   functions
//     .region('asia-east2')
//     .pubsub.schedule('every day 16:32')
//     .timeZone('Asia/Bangkok')
//     .onRun(() => {
//       admin.messaging().send(message_for_send)
//         .then((response) => {
//           console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//           console.error('Error sending message:', error);
//         });
//       return null;
//     });

//   res.status(200).json({ message: 'Notification scheduled' });
// }
