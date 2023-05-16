const telemed = require('../models/telemed')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await telemed.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};

exports.getList = async (req, res) => {
    let PATIENT_ID = req.params.id
    try {
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data = await telemed.find({PATIENT_ID}).populate('DOCTOR').sort({'MEET_DATE' : 1})
        return res.send({error : false,data :data})
    } catch (err) {
        return res.status(400)
    }
};



exports.adddata = async (req, res) => {
    let { MEET_DATE, HN ,LINK,DOCTOR,PATIENT_ID,RUN_HN,YEAR_HN} = req.body
    try {
        if(!MEET_DATE || !HN || !LINK|| !DOCTOR|| !PATIENT_ID){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const addtelemed_data = await telemed.create({MEET_DATE, HN ,LINK,DOCTOR,PATIENT_ID,RUN_HN,YEAR_HN })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,MEET_DATE, HN ,LINK,DOCTOR,PATIENT_ID,RUN_HN,YEAR_HN} = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const telemed_data = await telemed.findOne({ _id })
        telemed_data.MEET_DATE = MEET_DATE ?? telemed_data.MEET_DATE
        telemed_data.HN = HN ?? telemed_data.HN
        telemed_data.LINK = LINK ?? telemed_data.LINK
        telemed_data.DOCTOR = DOCTOR ?? telemed_data.DOCTOR
        telemed_data.PATIENT_ID = PATIENT_ID ?? telemed_data.PATIENT_ID
        telemed_data.RUN_HN = RUN_HN ?? telemed_data.RUN_HN
        telemed_data.YEAR_HN = YEAR_HN ?? telemed_data.YEAR_HN
        telemed_data.DATE_MODIFIED = Date.now()
        await telemed_data.save()
        return res.send({ error: false, message: 'Updated' })
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
        const telemed_data = await telemed.deleteOne({ _id: id })
        if (telemed_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};