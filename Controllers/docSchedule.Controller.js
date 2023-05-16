const docSchedule = require('../models/doc_schedule')

exports.getAll = async (req, res) => {

  try {
    const data = await docSchedule.find()
    return res.send(data)
  } catch (err) {
    return res.status(400)
  }
};



exports.adddata = async (req, res) => {

  let { CANCEL_FLAG, DAY_OF_WEEK, DURATION, END_DATE, START_DATE, START_TIME, END_TIME, SEQ, WEEK, SCHEDULE_TYPE, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR,WORK_ID } = req.body
  try {
    if ( !DAY_OF_WEEK || !DURATION || !END_DATE || !START_DATE || !START_TIME || !END_TIME || !SEQ || !WEEK || !SCHEDULE_TYPE || !NEW_CASE || !LIMIT_CASE  || !DOCTOR ||!WORK_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }

    const adddocSchedule = await docSchedule.create({ CANCEL_FLAG, DAY_OF_WEEK, DURATION, END_DATE, START_DATE, START_TIME, END_TIME, SEQ, WEEK, SCHEDULE_TYPE, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR,WORK_ID })
    return res.send({error : false,message : 'Created'})

  } catch (err) {
    return res.status(400)
  }
};

exports.updatedata = async (req, res) => {

  let { _id, CANCEL_FLAG, DAY_OF_WEEK, DURATION, END_DATE, START_DATE, START_TIME, END_TIME, SEQ, WEEK, SCHEDULE_TYPE, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR,WORK_ID } = req.body;
  try {
    if (!_id) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }

    const docSchedule_data = await docSchedule.findOne({ _id })
    docSchedule_data.CANCEL_FLAG = CANCEL_FLAG ?? docSchedule_data.CANCEL_FLAG
    docSchedule_data.DAY_OF_WEEK = DAY_OF_WEEK ?? docSchedule_data.DAY_OF_WEEK
    docSchedule_data.DURATION = DURATION ?? docSchedule_data.DURATION
    docSchedule_data.END_DATE = END_DATE ?? docSchedule_data.END_DATE
    docSchedule_data.START_DATE = START_DATE ?? docSchedule_data.START_DATE
    docSchedule_data.START_TIME = START_TIME ?? docSchedule_data.START_TIME
    docSchedule_data.END_TIME = END_TIME ?? docSchedule_data.END_TIME
    docSchedule_data.SEQ = SEQ ?? docSchedule_data.SEQ
    docSchedule_data.WEEK = WEEK ?? docSchedule_data.WEEK
    docSchedule_data.SCHEDULE_TYPE = SCHEDULE_TYPE ?? docSchedule_data.SCHEDULE_TYPE
    docSchedule_data.NEW_CASE = NEW_CASE ?? docSchedule_data.NEW_CASE
    docSchedule_data.LIMIT_CASE = LIMIT_CASE ?? docSchedule_data.LIMIT_CASE
    docSchedule_data.REMARK = REMARK ?? docSchedule_data.REMARK
    docSchedule_data.DOCTOR = DOCTOR ?? docSchedule_data.DOCTOR
    docSchedule_data.WORK_ID = WORK_ID ?? docSchedule_data.WORK_ID
    docSchedule_data.DATE_MODIFIED = Date.now()
    await docSchedule_data.save()
    return res.send({error : false,message : 'Updated'})

  } catch (err) {
    return res.status(400)
  }
};
exports.deleteOne = async (req, res) => {

  let id = req.params.id;
  try {
    if (!id) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const docSchedule_data = await docSchedule.deleteOne({ _id: id })
    if (docSchedule_data.deletedCount === 1) {
      return res.send({ error: false, message: 'Deleted' })
    } else {
      return res.send({ error: true, message: 'failed' })
    }


  } catch (err) {
    return res.status(400)
  }
};