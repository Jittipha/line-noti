const patientHealth = require('../models/patient_health')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await patientHealth.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};



exports.adddata = async (req, res) => {
    let { DISEASE_NAME, DISEASE_TYPE, HN ,INFORMANT,INFORMHOSP,INFORMUSER,PATIENT_ID,RUN_HN,USER_CREATED,USER_MODIFIED,YEAR_HN} = req.body
    try {
        if(!DISEASE_NAME || !DISEASE_TYPE || !INFORMANT|| !INFORMUSER|| !PATIENT_ID|| !USER_CREATED ||!USER_MODIFIED){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const addpatientHealth_data = await patientHealth.create({DISEASE_NAME, DISEASE_TYPE, HN ,INFORMANT,INFORMHOSP,INFORMUSER,PATIENT_ID,RUN_HN,USER_CREATED,USER_MODIFIED,YEAR_HN })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,DISEASE_NAME, DISEASE_TYPE, HN ,INFORMANT,INFORMHOSP,INFORMUSER,PATIENT_ID,RUN_HN,USER_CREATED,USER_MODIFIED,YEAR_HN} = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const patientHealth_data = await patientHealth.findOne({ _id })
        patientHealth_data.DISEASE_NAME = DISEASE_NAME ?? patientHealth_data.DISEASE_NAME
        patientHealth_data.DISEASE_TYPE = DISEASE_TYPE ?? patientHealth_data.DISEASE_TYPE
        patientHealth_data.HN = HN ?? patientHealth_data.HN
        patientHealth_data.INFORMANT = INFORMANT ?? patientHealth_data.INFORMANT
        patientHealth_data.INFORMHOSP = INFORMHOSP ?? patientHealth_data.INFORMHOSP
        patientHealth_data.INFORMUSER = INFORMUSER ?? patientHealth_data.INFORMUSER
        patientHealth_data.PATIENT_ID = PATIENT_ID ?? patientHealth_data.PATIENT_ID
        patientHealth_data.RUN_HN = RUN_HN ?? patientHealth_data.RUN_HN
        patientHealth_data.USER_CREATED = USER_CREATED ?? patientHealth_data.USER_CREATED
        patientHealth_data.USER_MODIFIED = USER_MODIFIED ?? patientHealth_data.USER_MODIFIED
        patientHealth_data.YEAR_HN = YEAR_HN ?? patientHealth_data.YEAR_HN
        patientHealth_data.DATE_MODIFIED = Date.now()
        await patientHealth_data.save()
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
        const patientHealth_data = await patientHealth.deleteOne({ _id: id })
        if (patientHealth_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};