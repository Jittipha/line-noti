const patient = require('../models/patient')
const patient_mobile = require('../models/patient_mobile')
const service = require('../services/General_services')

exports.getAll = async (req, res) => {

    try {
        const data = await patient.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};


exports.adddata = async (req, res) => {

    let { ID_CARD, HN,AGE_DAY,AGE_MONTH,AGE_YEAR,GENDER, E_FIRST_NAME, E_LAST_NAME,FIRST_NAME,LAST_NAME,NICK_NAME,BIRTHDATE,LINEID, MOBILE,EMAIL,BLOODGROUP,YEAR_HN,PRE_NAME,E_PRE_NAME } = req.body
    try {
        if(!ID_CARD||!HN ||!AGE_DAY||!AGE_MONTH||!AGE_YEAR||! GENDER ||! E_FIRST_NAME||! E_LAST_NAME ||! FIRST_NAME ||!LAST_NAME ||!NICK_NAME||!BIRTHDATE||!MOBILE ||!BLOODGROUP||! YEAR_HN ||!PRE_NAME ||!E_PRE_NAME ){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }

        const addmainpersonal = await patient.create({ID_CARD, HN, AGE_DAY, AGE_MONTH, AGE_YEAR, GENDER, E_FIRST_NAME, E_LAST_NAME,FIRST_NAME,LAST_NAME,NICK_NAME,BIRTHDATE,LINEID, MOBILE,EMAIL,BLOODGROUP,YEAR_HN,PRE_NAME,E_PRE_NAME })
        return res.send({error : false,message : 'Created'})

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id,ID_CARD, HN, GENDER, E_FIRST_NAME, E_LAST_NAME,FIRST_NAME,LAST_NAME,NICK_NAME,BIRTHDATE,LINEID, MOBILE,EMAIL,BLOODGROUP,YEAR_HN,PRE_NAME,E_PRE_NAME} = req.body;
    try {

        const mainpersonal_data = await patient.findOne({ _id })
        mainpersonal_data.ID_CARD = ID_CARD ?? mainpersonal_data.ID_CARD
        mainpersonal_data.HN = HN ?? mainpersonal_data.HN
        mainpersonal_data.GENDER = GENDER ?? mainpersonal_data.GENDER
        mainpersonal_data.E_FIRST_NAME = E_FIRST_NAME ?? mainpersonal_data.E_FIRST_NAME
        mainpersonal_data.E_LAST_NAME = E_LAST_NAME ?? mainpersonal_data.E_LAST_NAME
        mainpersonal_data.FIRST_NAME = FIRST_NAME ?? mainpersonal_data.FIRST_NAME
        mainpersonal_data.LAST_NAME = LAST_NAME ?? mainpersonal_data.LAST_NAME
        mainpersonal_data.NICK_NAME = NICK_NAME ?? mainpersonal_data.NICK_NAME
        mainpersonal_data.BIRTHDATE = BIRTHDATE ?? mainpersonal_data.BIRTHDATE
        mainpersonal_data.LINEID = LINEID ?? mainpersonal_data.LINEID
        mainpersonal_data.MOBILE = MOBILE ?? mainpersonal_data.MOBILE
        mainpersonal_data.EMAIL = EMAIL ?? mainpersonal_data.EMAIL
        mainpersonal_data.BLOODGROUP = BLOODGROUP ?? mainpersonal_data.BLOODGROUP
        mainpersonal_data.YEAR_HN = YEAR_HN ?? mainpersonal_data.YEAR_HN
        mainpersonal_data.PRE_NAME = PRE_NAME ?? mainpersonal_data.PRE_NAME
        mainpersonal_data.E_PRE_NAME = E_PRE_NAME ?? mainpersonal_data.E_PRE_NAME
        mainpersonal_data.DATE_MODIFIED = Date.now()
        await mainpersonal_data.save()
        return res.send({error : false,message:'Updated'})

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
        const mainpersonal_data = await patient.deleteOne({ _id: id })
        if (mainpersonal_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};