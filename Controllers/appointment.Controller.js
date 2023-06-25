const appointment = require("../models/appoint");
const { ObjectID } = require("bson");
const redis = require("redis");
const client = redis.createClient();
const moment = require("moment");
const today = moment().startOf("day");
const patient = require("../models/patient");
const momenttz = require("moment-timezone");
const service = require("../services/General_services");
const timezone = "Asia/Bangkok";
const pushNoti = require("./push-notification.Controller");
const notification = require("../models/notification");
exports.getAll = async (req, res) => {
  try {
    const data = await appointment.find();
    //   const data = await appointment.aggregate([
    //     {
    //       $lookup: {
    //         from: 'departments',
    //         localField: 'departmentID',
    //         foreignField: '_id',
    //         as: 'department'
    //       }
    //     },
    //     {
    //       $unwind: '$department'
    //     },
    //     {
    //       $lookup: {
    //         from: 'doctors',
    //         localField: 'doctorID',
    //         foreignField: '_id',
    //         as: 'doctor'
    //       }
    //     },
    //     {
    //       $unwind: '$doctor'
    //     },
    //     {
    //       $lookup: {
    //         from: 'prefix_doctors',
    //         localField: 'doctor.prefixDoctor',
    //         foreignField: '_id',
    //         as: 'doctor.prefix'
    //       }
    //     },
    //     {
    //       $unwind: '$doctor.prefix'
    //     },
    //     {
    //       $lookup: {
    //         from: 'time_workplan_doctors',
    //         localField: 'timeWorkplanDoctorID',
    //         foreignField: '_id',
    //         as: 'appointmentDate'
    //       }
    //     },
    //     {
    //       $unwind: '$appointmentDate'
    //     },
    //     {
    //       $lookup: {
    //         from: 'day_workplan_doctors',
    //         localField: 'appointmentDate.dayWorkplanDoctorID',
    //         foreignField: '_id',
    //         as: 'appointmentDate.date'
    //       }
    //     },
    //     {
    //       $unwind: '$appointmentDate.date'
    //     },
    //     {
    //       $project: {
    //         'departmentID': 0,
    //         'doctorID': 0,
    //         'timeWorkplanDoctorID': 0,
    //         'dayWorkplanDoctorID': 0,
    //         'createdAt': 0,
    //         'updatedAt': 0,
    //         '__v': 0,
    //         'department.createdAt': 0,
    //         'department.updatedAt': 0,
    //         'department.__v': 0,
    //         'doctor.prefixDoctor': 0,
    //         'doctor.createdAt': 0,
    //         'doctor.updatedAt': 0,
    //         'doctor.__v': 0,
    //         'doctor.prefix.createdAt': 0,
    //         'doctor.prefix.updatedAt': 0,
    //         'doctor.prefix.__v': 0,
    //         'appointmentDate.dayWorkplanDoctorID': 0,
    //         'appointmentDate.createdAt': 0,
    //         'appointmentDate.updatedAt': 0,
    //         'appointmentDate.__v': 0,
    //         'appointmentDate.date.doctorID': 0,
    //         'appointmentDate.date.createdAt': 0,
    //         'appointmentDate.date.updatedAt': 0,
    //         'appointmentDate.date.__v': 0,
    //       }
    //     }
    //   ])

    return res.send(data);
  } catch (err) {
    return res.status(400);
  }
};

exports.getByID = async (req, res) => {
  let _id = req.params.id;
  let req_data = req.params || req.body || req.query;

  try {
    if (!_id) {
      return res.send({ error: true, message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    appointment
      .aggregate([
        {
          $match: {
            _id: ObjectID(_id),
          },
        },
        {
          $lookup: {
            from: "patients",
            localField: "PATIENT_ID",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $unwind: "$patient",
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ])
      .exec(async function (err, data) {
        if (err) {
          console.log(err);
          return res.send({ error: true, data: err });
        }
        // await client.connect()
        // req_data.api = 'getByID'
        // const res_set = await client.setEx(JSON.stringify(req_data), 30, JSON.stringify(data[0]));
        return res.send({ error: false, data: data[0] });
      });
  } catch (err) {
    return res.status(400);
  }
};

exports.get_myappointment = async (req, res) => {
  let PATIENT_ID = req.params.id;
  // let req_data = req.params || req.body || req.query
  try {
    if (!PATIENT_ID) {
      return res.send({ error: true, message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    appointment
      .aggregate([
        {
          $match: {
            $and: [
              {
                PATIENT_ID: ObjectID(PATIENT_ID),
              },
              { APPOINT_DATE: { $gte: today.toDate() } },
            ],
          },
        },
        {
          $sort: {
            APPOINT_DATE: 1,
          },
        },
        {
          $project: {
            DATE_CREATED: 0,
            DATE_MODIFIED: 0,
            __v: 0,
          },
        },
      ])
      .exec(async (err, data) => {
        if (err) {
          console.log(err);
          return res.send({ error: true, data: err });
        }
        // await client.connect()
        // req_data.api = 'get_myappointment'
        // const res_set = await client.setEx(JSON.stringify(req_data), 20, JSON.stringify(data));
        return res.send({ error: false, data: data });
      });
  } catch (err) {
    return res.status(400);
  }
};

exports.adddata = async (req, res) => {
  let {
    APPOINT_DATE,
    APPOINT_TYPE,
    APPOINT_STATUS,
    CONFIRM_STATUS,
    START_TIME,
    END_TIME,
    PATIENT_ID,
    WORK_ID,
    DOCTOR,
    DEPART_ID,
    URGRNCY,
    SYMPTON,
    SYMPTON_REMARK,
  } = req.body;
  try {
    let filename = req.file.filename;
    const data_patient = await patient.findOne({ _id: PATIENT_ID });
    let HN = data_patient.HN;
    let query;

    if (APPOINT_TYPE == 3) {
      if (DOCTOR) {
        query = {
          PATIENT_ID,
          HN,
          URGRNCY,
          SYMPTON,
          SYMPTON_REMARK,
          DEPART_ID,
          DOCTOR,
          START_TIME,
          END_TIME,
          APPOINT_DATE,
          APPOINT_TYPE,
          APPOINT_STATUS,
          CONFIRM_STATUS,
          DURATION: "3",
          WORK_ID: "6400808bdff64fcde45142f1",
          IMAGE: filename,
        };
      } else {
        query = {
          PATIENT_ID,
          HN,
          URGRNCY,
          SYMPTON,
          SYMPTON_REMARK,
          APPOINT_TYPE,
          APPOINT_STATUS,
          CONFIRM_STATUS,
          APPOINT_DATE,
          IMAGE: filename,
        };
      }
    } else {
      query = {
        APPOINT_DATE,
        APPOINT_TYPE,
        APPOINT_STATUS,
        CONFIRM_STATUS,
        START_TIME,
        END_TIME,
        HN,
        PATIENT_ID,
        DOCTOR,
        DEPART_ID,
        DURATION: "3",
        WORK_ID: "6400808bdff64fcde45142f1",
      };
    }
    const addAppointment = await appointment.create(query);
    if (APPOINT_DATE != null || APPOINT_DATE != "") {
      let appoint_date = new Date(APPOINT_DATE);
      if (START_TIME != null || START_TIME != "") {
        appoint_date = service.add_time_in_date(APPOINT_DATE, START_TIME);
      }
      const now = service.add_time_in_date(new Date(), "07.00");
      const diff_date = service.cal_diff_date(now, appoint_date) + 1;
      let Noti_id = [];
      let message = {
        notification: {},
      };
      if (diff_date <= -5) {
        const date_for_noti = service.add_date(appoint_date, 5);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 5 วัน)";
        title_en = "Appointment (5 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 5 วัน";
        body_en = "You have an appointment in 5 days.";
        const noti_id = addAppointment.id + "-5d";
        pushNoti.specificDate(
          date_for_noti,
          message,
          noti_id,
          addAppointment.id
        );
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= -3) {
        const date_for_noti = service.add_date(appoint_date, 3);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 3 วัน)";
        title_en = "Appointment (3 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 3 วัน";
        body_en = "You have an appointment in 3 days.";
        const noti_id = addAppointment.id + "-3d";
        pushNoti.specificDate(
          date_for_noti,
          message,
          noti_id,
          addAppointment.id
        );
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= -1) {
        const date_for_noti = service.add_date(appoint_date, 1);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 1 วัน)";
        title_en = "Appointment (1 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 1 วัน";
        body_en = "You have an appointment in 1 days.";
        const noti_id = addAppointment.id + "-1d";
        pushNoti.specificDate(
          date_for_noti,
          message,
          noti_id,
          addAppointment.id
        );
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= 1) {
        const HoursInMillis = 1 * 60 * 60 * 1000;
        let appoint_date_for_noti_today = appoint_date;
        appoint_date_for_noti_today.setTime(
          appoint_date_for_noti_today.getTime() - HoursInMillis
        );
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 1 ชั่วโมง)";
        title_en = "Appointment (1 hour left)";
        message.notification.body = "คุณมีนัดหมายในอีก 1 ชั่วโมง";
        body_en = "You have an appointment in 1 hour.";
        const noti_id = addAppointment.id + "-1h";
        pushNoti.specificDate(
          appoint_date_for_noti_today,
          message,
          noti_id,
          addAppointment.id
        );
        Noti_id.push({
          noti_id: noti_id,
          date: appoint_date_for_noti_today,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      for (let x = 0; x < Noti_id.length; x++) {
        await notification.create({
          noti_id: Noti_id[x].noti_id,
          type: "1",
          datetime_noti: Noti_id[x].date,
          title: Noti_id[x].title,
          body: Noti_id[x].body,
          title_en: "Pre-appointment notification",
          body_en: Noti_id[x].body_en,
          status_read: "A",
          status_send: "D",
          PATIENT_ID,
          APPOINT_ID: addAppointment._id,
        });
      }
    }
    return res.send({ error: false, message: "Created" });
  } catch (err) {
    return res.status(400);
  }
};

// exports.update_appointmentDate = async (req, res) => {

//   let { _id, queueNumber,qrcodeNumber, doctorID, timeWorkplanDoctorID } = req.body
//   try {

//     const appointment_data = await appointment.findOne({ _id })
//     appointment_data.appointmentTime = appointmentTime
//     appointment_data.appointmentDate = qrcodeNumber
//     appointment_data.doctorID = doctorID
//     appointment_data.timeWorkplanDoctorID = timeWorkplanDoctorID
//     appointment_data.queueNumber = queueNumber
//     appointment_data.qrcodeNumber = qrcodeNumber
//     appointment_data.doctorID = doctorID
//     appointment_data.timeWorkplanDoctorID = timeWorkplanDoctorID
//     appointment_data.updatedAt = Date.now()
//     await appointment_data.save()
//     return res.send(appointment_data)

//   } catch (err) {
//     return res.status(400)
//   }
// };

exports.updatedata = async (req, res) => {
  let {
    _id,
    APPOINT_DATE,
    APPOINT_TYPE,
    APPOINT_STATUS,
    CONFIRM_STATUS,
    START_TIME,
    END_TIME,
    HN,
    PATIENT_ID,
    WORK_ID,
    DURATION,
    DOCTOR,
    DEPART_ID,
    URGRNCY,
    SYMPTON,
    SYMPTON_REMARK,
    TOKEN,
  } = req.body;
  try {
    let date_convert;
    if (APPOINT_DATE) {
      date_convert = new Date(APPOINT_DATE);
    }
    const appointment_data = await appointment.findOne({ _id });
    appointment_data.APPOINT_DATE =
      date_convert ?? appointment_data.APPOINT_DATE;
    appointment_data.APPOINT_TYPE =
      APPOINT_TYPE ?? appointment_data.APPOINT_TYPE;
    appointment_data.APPOINT_STATUS =
      APPOINT_STATUS ?? appointment_data.APPOINT_STATUS;
    appointment_data.CONFIRM_STATUS =
      CONFIRM_STATUS ?? appointment_data.CONFIRM_STATUS;
    appointment_data.START_TIME = START_TIME ?? appointment_data.START_TIME;
    appointment_data.END_TIME = END_TIME ?? appointment_data.END_TIME;
    appointment_data.HN = HN ?? appointment_data.HN;
    appointment_data.DURATION = DURATION ?? appointment_data.DURATION;
    appointment_data.PATIENT_ID = PATIENT_ID ?? appointment_data.PATIENT_ID;
    appointment_data.WORK_ID = WORK_ID ?? appointment_data.WORK_ID;
    appointment_data.DOCTOR = DOCTOR ?? appointment_data.DOCTOR;
    appointment_data.DEPART_ID = DEPART_ID ?? appointment_data.DEPART_ID;
    appointment_data.URGRNCY = URGRNCY ?? appointment_data.URGRNCY;
    appointment_data.SYMPTON = SYMPTON ?? appointment_data.SYMPTON;
    appointment_data.SYMPTON_REMARK =
      SYMPTON_REMARK ?? appointment_data.SYMPTON_REMARK;
    appointment_data.DATE_MODIFIED = Date.now();
    await appointment_data.save();

    if (APPOINT_DATE) {
      const data_notifacation = await notification.find({ APPOINT_ID: _id });
      for (let x = 0; x < data_notifacation.length; x++) {
        pushNoti.delete_notification(data_notifacation[x].noti_id);
      }
      const update_many_status = await notification.deleteMany({
        APPOINT_ID: _id,
      });
      let appoint_date = new Date(APPOINT_DATE);
      if (START_TIME) {
        appoint_date = service.add_time_in_date(APPOINT_DATE, START_TIME);
      }
      const now = service.add_time_in_date(new Date(), "07.00"); // ICT
      const diff_date = service.cal_diff_date(now, appoint_date) + 1;
      let Noti_id = [];
      let message = {
        notification: {},

        token: TOKEN,
      };
      if (diff_date <= -5) {
        const date_for_noti = service.add_date(appoint_date, 5);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 5 วัน)";
        title_en = "Appointment (5 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 5 วัน";
        body_en = "You have an appointment in 5 days.";
        const noti_id = _id + "-5d";
        pushNoti.specificDate(date_for_noti, message, noti_id, _id);
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= -3) {
        const date_for_noti = service.add_date(appoint_date, 3);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 3 วัน)";
        title_en = "Appointment (3 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 3 วัน";
        body_en = "You have an appointment in 3 days.";
        const noti_id = _id + "-3d";
        pushNoti.specificDate(date_for_noti, message, noti_id, _id);
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= -1) {
        const date_for_noti = service.add_date(appoint_date, 1);
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 1 วัน)";
        title_en = "Appointment (1 days left)";
        message.notification.body = "คุณมีนัดหมายในอีก 1 วัน";
        body_en = "You have an appointment in 1 days.";
        const noti_id = _id + "-1d";
        pushNoti.specificDate(date_for_noti, message, noti_id, _id);
        Noti_id.push({
          noti_id: noti_id,
          date: date_for_noti,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      if (diff_date <= 1) {
        const HoursInMillis = 1 * 60 * 60 * 1000;
        let appoint_date_for_noti_today = appoint_date;
        appoint_date_for_noti_today.setTime(
          appoint_date_for_noti_today.getTime() - HoursInMillis
        );
        message.notification.title = "แจ้งเตือนนัดหมาย (อีก 1 ชั่วโมง)";
        title_en = "Appointment (1 hour left)";
        message.notification.body = "คุณมีนัดหมายในอีก 1 ชั่วโมง";
        body_en = "You have an appointment in 1 hour.";
        const noti_id = _id + "-1h";
        pushNoti.specificDate(
          appoint_date_for_noti_today,
          message,
          noti_id,
          _id
        );
        Noti_id.push({
          noti_id: noti_id,
          date: appoint_date_for_noti_today,
          status: "A",
          title: message.notification.title,
          title_en,
          body: message.notification.body,
          body_en,
        });
      }
      for (let x = 0; x < Noti_id.length; x++) {
        await notification.create({
          noti_id: Noti_id[x].noti_id,
          type: "1",
          datetime_noti: Noti_id[x].date,
          title: Noti_id[x].title,
          body: Noti_id[x].body,
          title_en: Noti_id[x].title_en,
          body_en: Noti_id[x].body_en,
          status_read: "A",
          status_send: "D",
          PATIENT_ID: appointment_data.PATIENT_ID,
          APPOINT_ID: _id,
        });
      }
    }
    return res.send({ error: false, message: "updated" });
  } catch (err) {
    return res.status(400);
  }
};

exports.deleteOne = async (req, res) => {
  let id = req.params.id;
  try {
    if (!id) {
      return res.send({ error: true, message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    const appointment_data = appointment
      .deleteOne({ _id: id })
      .exec((err, data) => {
        if (err) return res.send({ error: true, data: err });
        if (data.deletedCount === 1) {
          return res.send({ error: false, message: "Deleted" });
        } else {
          return res.send({ error: true, message: "Delete failed" });
        }
      });
  } catch (err) {
    return res.status(400);
  }
};

exports.Cancel_Appoint = async (req, res) => {
  let { _id, CANCEL_REASON } = req.body;
  try {
    if (!_id) {
      return res.send({ error: true, message: "กรุณากรอกข้อมูลให้ครบ" });
    }
    const appointment_data = await appointment.findOne({ _id });
    appointment_data.APPOINT_STATUS = "C";
    appointment_data.CANCEL_REASON = CANCEL_REASON;
    appointment_data.DATE_MODIFIED = new Date();
    await appointment_data.save();
    const data_notifacation = await notification.find({ APPOINT_ID: _id });
    for (let x = 0; x < data_notifacation.length; x++) {
      pushNoti.delete_notification(data_notifacation[x].noti_id);
    }
    const update_many_status = await notification.updateMany(
      { APPOINT_ID: _id },
      { status_send: "C" }
    );
    return res.send({ error: false, message: "updated" });
  } catch (err) {
    return res.status(400);
  }
};
