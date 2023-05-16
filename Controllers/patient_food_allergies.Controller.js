const patientFoodAllerrgies = require('../models/patient_food_allergies')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await patientFoodAllerrgies.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};



exports.adddata = async (req, res) => {
    let { ALEVEL, FOOD_NAME, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN} = req.body
    try {
        if(!ALEVEL || !FOOD_NAME || !INFORMANT|| !INFORMUSER|| !PATIENT_ID|| !USER_CREATED ||!USER_MODIFIED){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const addpatientFoodAllerrgies = await patientFoodAllerrgies.create({ALEVEL, FOOD_NAME, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,ALEVEL, FOOD_NAME, HN ,INFORMANT,INFORMHOSP,INFORMUSER,LOCK_FLAG,OTHER_SYMPTOM,PATIENT_ID,RUN_HN,SYMPTOM,TYPEDX,USER_CREATED,USER_MODIFIED,YEAR_HN } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const patientFoodAllerrgies_data = await patientFoodAllerrgies.findOne({ _id })
        patientFoodAllerrgies_data.ALEVEL = ALEVEL ?? patientFoodAllerrgies_data.ALEVEL
        patientFoodAllerrgies_data.FOOD_NAME = FOOD_NAME ?? patientFoodAllerrgies_data.FOOD_NAME
        patientFoodAllerrgies_data.HN = HN ?? patientFoodAllerrgies_data.HN
        patientFoodAllerrgies_data.INFORMANT = INFORMANT ?? patientFoodAllerrgies_data.INFORMANT
        patientFoodAllerrgies_data.INFORMHOSP = INFORMHOSP ?? patientFoodAllerrgies_data.INFORMHOSP
        patientFoodAllerrgies_data.INFORMUSER = INFORMUSER ?? patientFoodAllerrgies_data.INFORMUSER
        patientFoodAllerrgies_data.LOCK_FLAG = LOCK_FLAG ?? patientFoodAllerrgies_data.LOCK_FLAG
        patientFoodAllerrgies_data.OTHER_SYMPTOM = OTHER_SYMPTOM ?? patientFoodAllerrgies_data.OTHER_SYMPTOM
        patientFoodAllerrgies_data.PATIENT_ID = PATIENT_ID ?? patientFoodAllerrgies_data.PATIENT_ID
        patientFoodAllerrgies_data.RUN_HN = RUN_HN ?? patientFoodAllerrgies_data.RUN_HN
        patientFoodAllerrgies_data.SYMPTOM = SYMPTOM ?? patientFoodAllerrgies_data.SYMPTOM
        patientFoodAllerrgies_data.TYPEDX = TYPEDX ?? patientFoodAllerrgies_data.TYPEDX
        patientFoodAllerrgies_data.USER_CREATED = USER_CREATED ?? patientFoodAllerrgies_data.USER_CREATED
        patientFoodAllerrgies_data.USER_MODIFIED = USER_MODIFIED ?? patientFoodAllerrgies_data.USER_MODIFIED
        patientFoodAllerrgies_data.YEAR_HN = YEAR_HN ?? patientFoodAllerrgies_data.YEAR_HN
        patientFoodAllerrgies_data.DATE_MODIFIED = Date.now()
        await patientFoodAllerrgies_data.save()
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
        const patientFoodAllerrgies_data = await patientFoodAllerrgies.deleteOne({ _id: id })
        if (patientFoodAllerrgies_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};