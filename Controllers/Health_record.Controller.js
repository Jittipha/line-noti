const opd_clinic = require('../models/opd_clinic')
const { ObjectID } = require('bson');
const moment = require('moment')
const service = require('../services/General_services')

exports.get_bmi_pressure_last_record = async (req, res) => {
    let PATIENT_ID = req.params.id
    try {
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const health_data = await opd_clinic.findOne({ PATIENT_ID }).select('BMI WEIGHT HEIGHT BP_DIASTOLIC BP_SYSTOLIC CLINIC_DATE').sort({ CLINIC_DATE: -1 })
        return res.send({ error: false, data: health_data })
    } catch (err) {
        return res.status(400)
    }
};

exports.get_health_nearby_date = async (req, res) => {
    let { PATIENT_ID, DATE } = req.body
    try {
        if (!PATIENT_ID || !DATE) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        CONFIG_FIELD = {
            $project : {
                "_id" : 1,
                "CLINIC_DATE" : 1,
                "HEIGHT" : 1,
                "WEIGHT" : 1,
                "BP_DIASTOLIC" : 1,
                "BP_SYSTOLIC" : 1,
            }
        }
        const data_health = await opd_clinic.aggregate([
            {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            CLINIC_DATE: { $eq: new Date(DATE) }
                        }

                    ]
                }
            },
            CONFIG_FIELD
        ])
        if(data_health.length === 0){
            const data_health_gt = await opd_clinic.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                PATIENT_ID: ObjectID(PATIENT_ID)
                            },
                            {
                                CLINIC_DATE: { $gt: new Date(DATE) }
                            }
    
                        ]
                    }
                },
                CONFIG_FIELD,
                {
                    $sort : {
                        CLINIC_DATE : 1
                    }
                },
                {
                    $limit  : 1
                }
            ])
            const data_health_lt = await opd_clinic.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                PATIENT_ID: ObjectID(PATIENT_ID)
                            },
                            {
                                CLINIC_DATE: { $lt: new Date(DATE) }
                            }
    
                        ]
                    }
                },
                CONFIG_FIELD,
                {
                    $sort : {
                        CLINIC_DATE : -1
                    }
                },
                {
                    $limit  : 1
                }
            ])
            if(data_health_gt.length === 0){
                return res.send({ error: false, data: data_health_lt[0] })
            }
            else if(data_health_lt.length === 0){
                return res.send({ error: false, data: data_health_gt[0] })
            }
            else{
                count_day_gt =  services.cal_diff_date(new Date( data_health_gt[0].CLINIC_DATE),new Date(DATE))
                count_day_lt =  services.cal_diff_date(new Date(DATE),new Date( data_health_lt[0].CLINIC_DATE))
                if(count_day_lt < count_day_gt){
                    return res.send({ error: false, data: data_health_lt[0] })
                }else{
                    return res.send({ error: false, data: data_health_gt[0] })
                }
            }

        }
        return res.send({ error: false, data: data_health })
    } catch (err) {
        return res.status(400)
    }
};




exports.get_health_history = async (req, res) => {
    let { PATIENT_ID, DATE_FROM, DATE_TO, PRESSURE } = req.body
    console.log(PATIENT_ID,DATE_FROM,DATE_TO,PRESSURE)
    let query
    let CONFIG_FIELD
    try {
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if (PRESSURE == "Y") {
            CONFIG_FIELD = { FIELD1: 'BP_SYSTOLIC', FIELD2: 'BP_DIASTOLIC' }
        }
        else {
            CONFIG_FIELD = { FIELD1: 'HEIGHT', FIELD2: 'WEIGHT' }
        }
        if (!DATE_FROM) {
            const startofyear = moment().startOf('year').toDate()
            const endOfMonth = moment(new Date(DATE_TO)).endOf('month').toDate()
            query = {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            'CLINIC_DATE': { $gte: startofyear }
                        },
                        {
                            'CLINIC_DATE': { $lte: endOfMonth }
                        },
                    ]
                }
            }
        }
        if (!DATE_TO) {
            const startofMonth = moment(new Date(DATE_FROM)).startOf('month').toDate()
            const endOfYear = moment().endOf('month').toDate()
            query = {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            'CLINIC_DATE': { $gte: startofMonth }
                        },
                        {
                            'CLINIC_DATE': { $lte: endOfYear }
                        },
                    ]
                }
            }
        }
        if (DATE_FROM && DATE_TO) {
            const startofMonth = moment(new Date(DATE_FROM)).startOf('month').toDate()
            const endOfMonth = moment(new Date(DATE_TO)).endOf('month').toDate()
            query = {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            'CLINIC_DATE': { $gte: startofMonth }
                        },
                        {
                            'CLINIC_DATE': { $lte: endOfMonth }
                        },
                    ]
                }
            }
        }
        if (!DATE_FROM && !DATE_TO) {
            const startofYear = moment().startOf('year').toDate()
            const endOfYear = moment().endOf('year').toDate()
            query = {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            'CLINIC_DATE': { $gte: startofYear }
                        },
                        {
                            'CLINIC_DATE': { $lte: endOfYear }
                        },
                    ]
                }
            }
        }
        // console.log(query)
        const data_health = await opd_clinic.aggregate([
            query,
            {
                $group: {
                    _id: { month: { $month: "$CLINIC_DATE" } },
                    Other_data1: { $avg: { $toInt: `$${CONFIG_FIELD.FIELD1}` } },
                    Other_data2: { $avg: { $toInt: `$${CONFIG_FIELD.FIELD2}` } }
                }
            },
            {
                $sort : {
                    '_id.month' : 1
                }
            }

        ])
        return res.send({ error: false, data: data_health })
    } catch (err) {
        return res.status(400)
    }
};