const patientDrugAllerrgiesGroup = require('../models/patient_drug_allergies_group')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await patientDrugAllerrgiesGroup.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};



exports.adddata = async (req, res) => {
    let { ALEVEL, GENERIC_GROUP, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN} = req.body
    try {
        if(!ALEVEL || !GENERIC_GROUP || !INFORMANT|| !INFORMUSER|| !PATIENT_ID|| !USER_CREATED ||!USER_MODIFIED){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const addPatientDrugAllerrgiesGroup = await patientDrugAllerrgiesGroup.create({ALEVEL, GENERIC_GROUP, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,ALEVEL, GENERIC_GROUP, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const patientDrugAllerrgiesGroup_data = await patientDrugAllerrgiesGroup.findOne({ _id })
        patientDrugAllerrgiesGroup_data.ALEVEL = ALEVEL ?? patientDrugAllerrgiesGroup_data.ALEVEL
        patientDrugAllerrgiesGroup_data.GENERIC_GROUP = GENERIC_GROUP ?? patientDrugAllerrgiesGroup_data.GENERIC_GROUP
        patientDrugAllerrgiesGroup_data.HN = HN ?? patientDrugAllerrgiesGroup_data.HN
        patientDrugAllerrgiesGroup_data.INFORMANT = INFORMANT ?? patientDrugAllerrgiesGroup_data.INFORMANT
        patientDrugAllerrgiesGroup_data.INFORMHOSP = INFORMHOSP ?? patientDrugAllerrgiesGroup_data.INFORMHOSP
        patientDrugAllerrgiesGroup_data.INFORMUSER = INFORMUSER ?? patientDrugAllerrgiesGroup_data.INFORMUSER
        patientDrugAllerrgiesGroup_data.LOCK_FLAG = LOCK_FLAG ?? patientDrugAllerrgiesGroup_data.LOCK_FLAG
        patientDrugAllerrgiesGroup_data.OTHER_SYMPTOM = OTHER_SYMPTOM ?? patientDrugAllerrgiesGroup_data.OTHER_SYMPTOM
        patientDrugAllerrgiesGroup_data.PATIENT_ID = PATIENT_ID ?? patientDrugAllerrgiesGroup_data.PATIENT_ID
        patientDrugAllerrgiesGroup_data.RUN_HN = RUN_HN ?? patientDrugAllerrgiesGroup_data.RUN_HN
        patientDrugAllerrgiesGroup_data.SYMPTOM = SYMPTOM ?? patientDrugAllerrgiesGroup_data.SYMPTOM
        patientDrugAllerrgiesGroup_data.TYPEDX = TYPEDX ?? patientDrugAllerrgiesGroup_data.TYPEDX
        patientDrugAllerrgiesGroup_data.USER_CREATED = USER_CREATED ?? patientDrugAllerrgiesGroup_data.USER_CREATED
        patientDrugAllerrgiesGroup_data.USER_MODIFIED = USER_MODIFIED ?? patientDrugAllerrgiesGroup_data.USER_MODIFIED
        patientDrugAllerrgiesGroup_data.YEAR_HN = YEAR_HN ?? patientDrugAllerrgiesGroup_data.YEAR_HN
        patientDrugAllerrgiesGroup_data.DATE_MODIFIED = Date.now()
        await patientDrugAllerrgiesGroup_data.save()
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
        const patientDrugAllerrgiesGroup_data = await patientDrugAllerrgiesGroup.deleteOne({ _id: id })
        if (patientDrugAllerrgiesGroup_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};