const opd_right = require('../models/opd_right')

exports.getAll = async (req, res) => {

    try {
        const data = await opd_right.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};




exports.adddata = async (req, res) => {

    let { AMOUNT, APPROVAL_DATE, CLAIM, CONFIRM, COPAY, DATE_CONFIRM, DISCOUNT, HN, LIMIT, MAIN_FLAG, PAYMENT, REMARK, RUN_HN, YEAR_HN, PATIENT_ID, USER_COMFIRM, USER_CREATED, RIGHT_ID } = req.body
    try {

        const addOpd_clinic = await opd_right.create({ AMOUNT, APPROVAL_DATE, CLAIM, CONFIRM, COPAY, DATE_CONFIRM, DISCOUNT, HN, LIMIT, MAIN_FLAG, PAYMENT, REMARK, RUN_HN, YEAR_HN, PATIENT_ID, USER_COMFIRM, USER_CREATED, RIGHT_ID })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, AMOUNT, APPROVAL_DATE, CLAIM, CONFIRM, COPAY, DATE_CONFIRM, DISCOUNT, HN, LIMIT, MAIN_FLAG, PAYMENT, REMARK, RUN_HN, YEAR_HN, PATIENT_ID, USER_COMFIRM, USER_CREATED, USER_MODIFIED, RIGHT_ID } = req.body;
    try {

        const opd_clinic_data = await opd_right.findOne({ _id })
        opd_clinic_data.AMOUNT = AMOUNT ?? opd_clinic_data.AMOUNT
        opd_clinic_data.APPROVAL_DATE = APPROVAL_DATE ?? opd_clinic_data.APPROVAL_DATE
        opd_clinic_data.CLAIM = CLAIM ?? opd_clinic_data.CLAIM
        opd_clinic_data.CONFIRM = CONFIRM ?? opd_clinic_data.CONFIRM
        opd_clinic_data.COPAY = COPAY ?? opd_clinic_data.COPAY
        opd_clinic_data.DATE_CONFIRM = DATE_CONFIRM ?? opd_clinic_data.DATE_CONFIRM
        opd_clinic_data.DISCOUNT = AMOUDISCOUNTNT ?? opd_clinic_data.DISCOUNT
        opd_clinic_data.HN = HN ?? opd_clinic_data.HN
        opd_clinic_data.DISCOUNT = DISCOUNT ?? opd_clinic_data.DISCOUNT
        opd_clinic_data.LIMIT = LIMIT ?? opd_clinic_data.LIMIT
        opd_clinic_data.MAIN_FLAG = MAIN_FLAG ?? opd_clinic_data.MAIN_FLAG
        opd_clinic_data.PAYMENT = PAYMENT ?? opd_clinic_data.PAYMENT
        opd_clinic_data.REMARK = REMARK ?? opd_clinic_data.REMARK
        opd_clinic_data.RUN_HN = RUN_HN ?? opd_clinic_data.RUN_HN
        opd_clinic_data.YEAR_HN = YEAR_HN ?? opd_clinic_data.YEAR_HN
        opd_clinic_data.PATIENT_ID = PATIENT_ID ?? opd_clinic_data.PATIENT_ID
        opd_clinic_data.USER_COMFIRM = USER_COMFIRM ?? opd_clinic_data.USER_COMFIRM
        opd_clinic_data.USER_CREATED = USER_CREATED ?? opd_clinic_data.USER_CREATED
        opd_clinic_data.USER_MODIFIED = USER_MODIFIED ?? opd_clinic_data.USER_MODIFIED
        opd_clinic_data.RIGHT_ID = RIGHT_ID ?? opd_clinic_data.RIGHT_ID
        opd_clinic_data.DATE_MODIFIED = Date.now()
        await opd_clinic_data.save()
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
        const opd_clinic_data = await opd_right.deleteOne({ _id: id })
        if (opd_clinic_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};