const { ObjectID } = require('bson');
const finance = require('../models/finance');
const patient = require('../models/patient');

exports.getAll = async (req, res) => {

    try {
        const data = await finance.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let { AGE, AMOUNT, AN, CASH_NOT_RETURN, CASH_RETURN, CLAIM, DATE_ACCEPTED, DATE_CREATED, DATE_DISPENSED, DATE_MODIFIED, DATE_PAYABLED, DATE_PREPARED, DATE_STATUSED, DISCOUNT, DOC_REMARK, DOCTOR_DONE_FLAG, EXPENSE_NAME, FINANCE_TYPE, GENDER, HN, ORDER_DATE, ORDER_REMARK, ORDER_TIME, PRICE, QUANTITY, QUEUE_BRANCH, QUEUE_NO, READING_FLAG, RECEIVE, REFILL_ID, RETURN_QTY, ROBOT_STATUS, ROOT_CLAIM, ROOT_COPAY, ROOT_PRICE, ROOT_QTY, RUN_AN, RUN_HN, STATUS, YEAR_AN, YEAR_HN, APPOINT_ID, DOCTOR, ORDER_ID, PATIENT_ID, USER_STATUSED, USER_PREPARED, USER_DISPENSED, USER_MODIFIED, USER_PAYABLED, USER_CREATED, USER_CHECKED, USER_ADR, USER_ACCEPTED,DRUG_WARNING,DRUG_USING,DRUG_TIMING,DRUG_PROPERTY,DRUG_PROFILE_ID,DRUG_LABEL,GENERIC,COPAY,CLINIC_ID } = req.body
    try {

        const addFinance = await finance.create({ AGE, AMOUNT, AN, CASH_NOT_RETURN, CASH_RETURN, CLAIM, DATE_ACCEPTED, DATE_CREATED, DATE_DISPENSED, DATE_MODIFIED, DATE_PAYABLED, DATE_PREPARED, DATE_STATUSED, DISCOUNT, DOC_REMARK, DOCTOR_DONE_FLAG, EXPENSE_NAME, FINANCE_TYPE, GENDER, HN, ORDER_DATE, ORDER_REMARK, ORDER_TIME, PRICE, QUANTITY, QUEUE_BRANCH, QUEUE_NO, READING_FLAG, RECEIVE, REFILL_ID, RETURN_QTY, ROBOT_STATUS, ROOT_CLAIM, ROOT_COPAY, ROOT_PRICE, ROOT_QTY, RUN_AN, RUN_HN, STATUS, YEAR_AN, YEAR_HN, APPOINT_ID, DOCTOR, ORDER_ID, PATIENT_ID, USER_STATUSED, USER_PREPARED, USER_DISPENSED, USER_MODIFIED, USER_PAYABLED, USER_CREATED, USER_CHECKED, USER_ADR, USER_ACCEPTED,DRUG_WARNING,DRUG_USING,DRUG_TIMING,DRUG_PROPERTY,DRUG_PROFILE_ID,DRUG_LABEL,GENERIC,COPAY,CLINIC_ID })
        return res.send({ error: false, message: 'Created' })

    } catch (err) {
        return res.status(400)
    }
};





exports.updatedata = async (req, res) => {

    let { _id, AGE, AMOUNT, AN, CASH_NOT_RETURN, CASH_RETURN, CLAIM, DATE_ACCEPTED, DATE_CREATED, DATE_DISPENSED, DATE_MODIFIED, DATE_PAYABLED, DATE_PREPARED, DATE_STATUSED, DISCOUNT, DOC_REMARK, DOCTOR_DONE_FLAG, EXPENSE_NAME, FINANCE_TYPE, GENDER, HN, ORDER_DATE, ORDER_REMARK, ORDER_TIME, PRICE, QUANTITY, QUEUE_BRANCH, QUEUE_NO, READING_FLAG, RECEIVE, REFILL_ID, RETURN_QTY, ROBOT_STATUS, ROOT_CLAIM, ROOT_COPAY, ROOT_PRICE, ROOT_QTY, RUN_AN, RUN_HN, STATUS, YEAR_AN, YEAR_HN, APPOINT_ID, DOCTOR, ORDER_ID, PATIENT_ID, USER_STATUSED, USER_PREPARED, USER_DISPENSED, USER_MODIFIED, USER_PAYABLED, USER_CREATED, USER_CHECKED, USER_ADR, USER_ACCEPTED,DRUG_WARNING,DRUG_USING,DRUG_TIMING,DRUG_PROPERTY,DRUG_PROFILE_ID,DRUG_LABEL,GENERIC,COPAY,CLINIC_ID } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const finance_data = await finance.findOne({ _id })
        finance_data.AGE = AGE ?? finance_data.AGE
        finance_data.AMOUNT = AMOUNT ?? finance_data.AMOUNT
        finance_data.AN = AN ?? finance_data.AN
        finance_data.CASH_NOT_RETURN = CASH_NOT_RETURN ?? finance_data.CASH_NOT_RETURN
        finance_data.CASH_RETURN = CASH_RETURN ?? finance_data.CASH_RETURN
        finance_data.CLAIM = CLAIM ?? finance_data.CLAIM
        finance_data.DATE_ACCEPTED = DATE_ACCEPTED ?? finance_data.DATE_ACCEPTED
        finance_data.DATE_CREATED = DATE_CREATED ?? finance_data.DATE_CREATED
        finance_data.DATE_DISPENSED = DATE_DISPENSED ?? finance_data.DATE_DISPENSED
        finance_data.DATE_MODIFIED = DATE_MODIFIED ?? finance_data.DATE_MODIFIED
        finance_data.DATE_PAYABLED = DATE_PAYABLED ?? finance_data.DATE_PAYABLED
        finance_data.DATE_PREPARED = DATE_PREPARED ?? finance_data.ADATE_PREPAREDGE
        finance_data.DATE_STATUSED = DATE_STATUSED ?? finance_data.DATE_STATUSED
        finance_data.DISCOUNT = DISCOUNT ?? finance_data.DISCOUNT
        finance_data.DOC_REMARK = DOC_REMARK ?? finance_data.DOC_REMARK
        finance_data.DOCTOR_DONE_FLAG = DOCTOR_DONE_FLAG ?? finance_data.DOCTOR_DONE_FLAG
        finance_data.EXPENSE_NAME = EXPENSE_NAME ?? finance_data.EXPENSE_NAME
        finance_data.FINANCE_TYPE = FINANCE_TYPE ?? finance_data.FINANCE_TYPE
        finance_data.GENDER = GENDER ?? finance_data.GENDER
        finance_data.HN = HN ?? finance_data.HN
        finance_data.ORDER_DATE = ORDER_DATE ?? finance_data.ORDER_DATE
        finance_data.ORDER_REMARK = ORDER_REMARK ?? finance_data.ORDER_REMARK
        finance_data.ORDER_TIME = ORDER_TIME ?? finance_data.ORDER_TIME
        finance_data.PRICE = PRICE ?? finance_data.PRICE
        finance_data.QUANTITY = QUANTITY ?? finance_data.QUANTITY
        finance_data.QUEUE_BRANCH = QUEUE_BRANCH ?? finance_data.QUEUE_BRANCH
        finance_data.QUEUE_NO = QUEUE_NO ?? finance_data.QUEUE_NO
        finance_data.READING_FLAG = READING_FLAG ?? finance_data.READING_FLAG
        finance_data.RECEIVE = RECEIVE ?? finance_data.RECEIVE
        finance_data.REFILL_ID = REFILL_ID ?? finance_data.REFILL_ID
        finance_data.RETURN_QTY = RETURN_QTY ?? finance_data.RETURN_QTY
        finance_data.ROBOT_STATUS = ROBOT_STATUS ?? finance_data.ROBOT_STATUS
        finance_data.ROOT_CLAIM = ROOT_CLAIM ?? finance_data.ROOT_CLAIM
        finance_data.ROOT_COPAY = ROOT_COPAY ?? finance_data.ROOT_COPAY
        finance_data.ROOT_PRICE = ROOT_PRICE ?? finance_data.ROOT_PRICE
        finance_data.ROOT_QTY = ROOT_QTY ?? finance_data.ROOT_QTY
        finance_data.RUN_AN = RUN_AN ?? finance_data.RUN_AN
        finance_data.RUN_HN = RUN_HN ?? finance_data.RUN_HN
        finance_data.STATUS = STATUS ?? finance_data.STATUS
        finance_data.YEAR_AN = YEAR_AN ?? finance_data.YEAR_AN
        finance_data.YEAR_HN = YEAR_HN ?? finance_data.YEAR_HN
        finance_data.APPOINT_ID = APPOINT_ID ?? finance_data.APPOINT_ID
        finance_data.DOCTOR = DOCTOR ?? finance_data.DOCTOR
        finance_data.ORDER_ID = ORDER_ID ?? finance_data.ORDER_ID
        finance_data.CLINIC_ID = CLINIC_ID ?? finance_data.CLINIC_ID
        finance_data.PATIENT_ID = PATIENT_ID ?? finance_data.PATIENT_ID
        finance_data.USER_STATUSED = USER_STATUSED ?? finance_data.USER_STATUSED
        finance_data.USER_PREPARED = USER_PREPARED ?? finance_data.USER_PREPARED
        finance_data.USER_DISPENSED = USER_DISPENSED ?? finance_data.USER_DISPENSED
        finance_data.USER_MODIFIED = USER_MODIFIED ?? finance_data.USER_MODIFIED
        finance_data.USER_PAYABLED = USER_PAYABLED ?? finance_data.USER_PAYABLED
        finance_data.USER_CREATED = USER_CREATED ?? finance_data.USER_CREATED
        finance_data.USER_CHECKED = USER_CHECKED ?? finance_data.USER_CHECKED
        finance_data.USER_ADR = USER_ADR ?? finance_data.USER_ADR
        finance_data.USER_ACCEPTED = USER_ACCEPTED ?? finance_data.USER_ACCEPTED
        finance_data.DRUG_WARNING = DRUG_WARNING ?? finance_data.DRUG_WARNING
        finance_data.DRUG_USING = DRUG_USING ?? finance_data.DRUG_USING
        finance_data.DRUG_TIMING = DRUG_TIMING ?? finance_data.DRUG_TIMING
        finance_data.DRUG_PROPERTY = DRUG_PROPERTY ?? finance_data.DRUG_PROPERTY
        finance_data.DRUG_PROFILE_ID = DRUG_PROFILE_ID ?? finance_data.DRUG_PROFILE_ID
        finance_data.DRUG_LABEL = DRUG_LABEL ?? finance_data.DRUG_LABEL
        finance_data.GENERIC = GENERIC ?? finance_data.GENERIC
        finance_data.COPAY = COPAY ?? finance_data.COPAY
        finance_data.DATE_MODIFIED = Date.now()
        await finance_data.save()
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
        const finance_data = await finance.deleteOne({ _id: id })
        if (finance_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};




