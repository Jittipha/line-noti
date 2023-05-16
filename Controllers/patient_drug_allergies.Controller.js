const patientDrugAllerrgies = require('../models/patient_drug_allergies')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await patientDrugAllerrgies.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};



exports.adddata = async (req, res) => {
    let { ALEVEL, GENERIC, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN} = req.body
    try {
        if(!ALEVEL || !GENERIC || !INFORMANT|| !INFORMUSER|| !PATIENT_ID|| !USER_CREATED ||!USER_MODIFIED){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const addpatientDrugAllerrgies = await patientDrugAllerrgies.create({ALEVEL, GENERIC, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN })
        return res.send({ error: false, message: 'Created'})

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,ALEVEL, GENERIC, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const patientDrugAllerrgies_data = await patientDrugAllerrgies.findOne({ _id })
        patientDrugAllerrgies_data.ALEVEL = ALEVEL ?? patientDrugAllerrgies_data.ALEVEL
        patientDrugAllerrgies_data.GENERIC = GENERIC ?? patientDrugAllerrgies_data.GENERIC
        patientDrugAllerrgies_data.HN = HN ?? patientDrugAllerrgies_data.HN
        patientDrugAllerrgies_data.INFORMANT = INFORMANT ?? patientDrugAllerrgies_data.INFORMANT
        patientDrugAllerrgies_data.INFORMHOSP = INFORMHOSP ?? patientDrugAllerrgies_data.INFORMHOSP
        patientDrugAllerrgies_data.INFORMUSER = INFORMUSER ?? patientDrugAllerrgies_data.INFORMUSER
        patientDrugAllerrgies_data.LOCK_FLAG = LOCK_FLAG ?? patientDrugAllerrgies_data.LOCK_FLAG
        patientDrugAllerrgies_data.OTHER_SYMPTOM = OTHER_SYMPTOM ?? patientDrugAllerrgies_data.OTHER_SYMPTOM
        patientDrugAllerrgies_data.PATIENT_ID = PATIENT_ID ?? patientDrugAllerrgies_data.PATIENT_ID
        patientDrugAllerrgies_data.RUN_HN = RUN_HN ?? patientDrugAllerrgies_data.RUN_HN
        patientDrugAllerrgies_data.SYMPTOM = SYMPTOM ?? patientDrugAllerrgies_data.SYMPTOM
        patientDrugAllerrgies_data.TYPEDX = TYPEDX ?? patientDrugAllerrgies_data.TYPEDX
        patientDrugAllerrgies_data.USER_CREATED = USER_CREATED ?? patientDrugAllerrgies_data.USER_CREATED
        patientDrugAllerrgies_data.USER_MODIFIED = USER_MODIFIED ?? patientDrugAllerrgies_data.USER_MODIFIED
        patientDrugAllerrgies_data.YEAR_HN = YEAR_HN ?? patientDrugAllerrgies_data.YEAR_HN
        patientDrugAllerrgies_data.DATE_MODIFIED = Date.now()
        await patientDrugAllerrgies_data.save()
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
        const patientDrugAllerrgies_data = await patientDrugAllerrgies.deleteOne({ _id: id })
        if (patientDrugAllerrgies_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};