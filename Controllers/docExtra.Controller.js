const docExtra = require('../models/doc_extra')

exports.getAll = async (req, res) => {

  try {
    const data = await docExtra.find()
    return res.send(data)
  } catch (err) {
    return res.status(400)
  }
};

exports.adddata = async (req, res) => {

  let { EXTRA_DATE, EXTRA_TYPE, START_TIME, END_TIME, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR,WORK_ID } = req.body
  try {
    if (!EXTRA_DATE || !EXTRA_TYPE || !START_TIME || !END_TIME || !NEW_CASE || !LIMIT_CASE || !DOCTOR  ||!WORK_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addDocExtra = await docExtra.create({ EXTRA_DATE, EXTRA_TYPE, START_TIME, END_TIME, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR ,WORK_ID })
    return res.send({error : false,message : 'Created'})
  } catch (err) {
    return res.status(400)
   }
};

exports.updatedata = async (req, res) => {

  let { _id, EXTRA_DATE, EXTRA_TYPE, START_TIME, END_TIME, NEW_CASE, LIMIT_CASE, REMARK, DOCTOR,WORK_ID } = req.body;
  try {
    if (!_id) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }

    const docExtra_data = await docExtra.findOne({ _id })
    docExtra_data.EXTRA_DATE = EXTRA_DATE ?? docSchedule_data.EXTRA_DATE
    docExtra_data.EXTRA_TYPE = EXTRA_TYPE ?? docSchedule_data.EXTRA_TYPE
    docExtra_data.START_TIME = START_TIME ?? docSchedule_data.START_TIME
    docExtra_data.END_DATE = END_TIME ?? docSchedule_data.END_TIME
    docExtra_data.NEW_CASE = NEW_CASE ?? docSchedule_data.NEW_CASE
    docExtra_data.LIMIT_CASE = LIMIT_CASE ?? docSchedule_data.LIMIT_CASE
    docExtra_data.REMARK = REMARK ?? docSchedule_data.REMARK
    docExtra_data.DOCTOR = DOCTOR ?? docSchedule_data.DOCTOR
    docExtra_data.WORK_ID = WORK_ID ?? docSchedule_data.WORK_ID
    docExtra_data.DATE_MODIFIED = Date.now()
    await docExtra_data.save()
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
    const docExtra_data = await docExtra.deleteOne({ _id: id })
    if (docExtra_data.deletedCount === 1) {
      return res.send({ error: false, message: 'Deleted' })
    } else {
      return res.send({ error: true, message: 'failed' })
    }


  } catch (err) {
    return res.status(400)
  }
};