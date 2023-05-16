const xray_result = require('../models/xray_result')
const opd_clinic = require('../models/opd_clinic')
const lab_result = require('../models/lab_result')
const { ObjectID } = require('bson')
const moment = require('moment')
const today = moment().startOf('day')

exports.getByPatient = async (req, res) => {
    let { PATIENT_ID, SORT, TEXT_SEARCH } = req.body
    try {
        if (!SORT) {
            SORT = 1
        }
        else {
            SORT = parseInt(SORT)
        }
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        opd_clinic.aggregate([
            {
                $match: { PATIENT_ID: ObjectID(PATIENT_ID) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'DOCTOR',
                    foreignField: '_id',
                    as: 'DOCTOR'
                }
            },
            {
                $unwind: '$DOCTOR'
            },
            // {
            //     $project: {
            //         'DOCTOR.FULL_NAME': { $concat : [ "$DOCTOR.PRE_NAME"," ","$DOCTOR.FIRST_NAME"," ","$DOCTOR.LAST_NAME"]},
            //     }
            // },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'DOCTOR.DEPART_ID',
                    foreignField: '_id',
                    as: 'DEPARTMENT'
                }
            },
            {
                $unwind: '$DEPARTMENT'
            },

            {
                $sort: {
                    'CLINIC_DATE': SORT
                }
            },
            {
                $project: {
                    "_id": 1,
                    "CLINIC_DATE": 1,
                    "FINISH_FLAG": 1,
                    'DOCTOR._id': 1,
                    'DOCTOR.POSITION': 1,
                    'DOCTOR.PRE_NAME': 1,
                    'DOCTOR.FIRST_NAME': 1,
                    'DOCTOR.LAST_NAME': 1,
                    'DOCTOR.FULL_NAME': { $concat: ["$DOCTOR.PRE_NAME", " ", "$DOCTOR.FIRST_NAME", " ", "$DOCTOR.LAST_NAME"] },
                    "PATIENT_ID": 1,
                    "AGE_YEAR": 1,
                    "SUGGESTION": 1,
                    'DEPARTMENT._id': 1,
                    'DEPARTMENT.departmentName': 1,
                },

            },
            {
                $match: {
                    $or: [
                        {
                            'DEPARTMENT.departmentName': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                        {
                            'DOCTOR.FULL_NAME': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                    ]
                }
            },


        ]).exec((err, data) => {
            if (err) throw err
            if (data.length == 0) {
                return res.send({ error: false, message: 'ไม่มีข้อมูล', data: data })
            }
            return res.send({ error: false, data: data })
        })

    } catch (err) {
        return res.status(400)
    }

}

exports.getByOPD_CLINIC_ID = async (req, res) => {
    let OPD_CLINIC_ID = req.params.id
    console.log('asdasd')
    try {
        console.log(OPD_CLINIC_ID)
        if (!OPD_CLINIC_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data = await opd_clinic.aggregate([
            {
                $match: { _id: ObjectID(OPD_CLINIC_ID) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'DOCTOR',
                    foreignField: '_id',
                    as: 'DOCTOR'
                }
            },
            {
                $unwind: '$DOCTOR'
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'DOCTOR.DEPART_ID',
                    foreignField: '_id',
                    as: 'DEPARTMENT'
                }
            },
            {
                $unwind: '$DEPARTMENT'
            },
            {
                $lookup: {
                    from: 'finances',
                    localField: '_id',
                    foreignField: 'CLINIC_ID',
                    as: 'DRUG'
                }
            },
            {
                $project: {
                    'AFTER_DR_DATE': 0,
                    'AGE_DAY': 0,
                    'AGE_MONTH': 0,
                    'HN': 0,
                    'USER_CREATED': 0,
                    'USER_MODIFIED': 0,
                    'WORK_ID': 0,
                    'DEPARTMENT.DATE_CREATED': 0,
                    'DEPARTMENT.DATE_MODIFIED': 0,
                    'DEPARTMENT.__v': 0,
                    'DOCTOR.DATE_CREATED': 0,
                    'DOCTOR.DATE_MODIFIED': 0,
                    'DOCTOR.__v': 0,
                    'DATE_CREATED': 0,
                    'DATE_MODIFIED': 0,
                    '__v': 0,
                    'DRUG.AGE': 0,
                    'DRUG.AMOUNT': 0,
                    'DRUG.CLAIM': 0,
                    'DRUG.DATE_ACCEPTED': 0,
                    'DRUG.DATE_CREATED': 0,
                    'DRUG.DATE_DISPENSED': 0,
                    'DRUG.DATE_MODIFIED': 0,
                    'DRUG.DATE_PAYABLED': 0,
                    'DRUG.DATE_STATUSED': 0,
                    'DRUG.DISCOUNT': 0,
                    'DRUG.DOCTOR_DONE_FLAG': 0,
                    'DRUG.EXPENSE_NAME': 0,
                    'DRUG.FINANCE_TYPE': 0,
                    'DRUG.GENDER': 0,
                    'DRUG.HN': 0,
                    'DRUG.ORDER_DATE': 0,
                    'DRUG.ORDER_TIME': 0,
                    'DRUG.PRICE': 0,
                    'DRUG.STATUS': 0,
                    'DRUG.YEAR_HN': 0,
                    'DRUG.APPOINT_ID': 0,
                    'DRUG.DOCTOR': 0,
                    'DRUG.ORDER_ID': 0,
                    'DRUG.PATIENT_ID': 0,
                    'DRUG.USER_STATUSED': 0,
                    'DRUG.USER_PREPARED': 0,
                    'DRUG.USER_DISPENSED': 0,
                    'DRUG.USER_MODIFIED': 0,
                    'DRUG.USER_PAYABLED': 0,
                    'DRUG.USER_CREATED': 0,
                    'DRUG.USER_CHECKED': 0,
                    'DRUG.USER_ADR': 0,
                    'DRUG.USER_ACCEPTED': 0,
                    'DRUG.__v': 0,
                    'DRUG.QUANTITY': 0,
                    'DRUG.COPAY': 0,
                    'DRUG.CLINIC_ID': 0,



                }
            }
        ])
        return res.send({ error: false, data: data[0] })
    } catch (err) {
        return res.status(400)
    }

}

exports.getByDate = async (req, res) => {
    let { PATIENT_ID, date, key } = req.body
    try {
        const startDate = moment(date).startOf('day').toDate()
        const endDate = moment(date).endOf('day').toDate()
        if (!PATIENT_ID|| !date || !key) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if (key == '1') {
            let data = await opd_clinic.aggregate([
                {
                    $match: {
                        $and: [{ PATIENT_ID: ObjectID(PATIENT_ID) },
                        { 'CLINIC_DATE': { $gte: startDate } }, { 'CLINIC_DATE': { $lte: endDate } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'DOCTOR',
                        foreignField: '_id',
                        as: 'DOCTOR'
                    }
                },
                {
                    $unwind: '$DOCTOR'
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'DOCTOR.DEPART_ID',
                        foreignField: '_id',
                        as: 'DEPARTMENT'
                    }
                },
                {
                    $unwind: '$DEPARTMENT'
                },
                {
                    $lookup: {
                        from: 'patients',
                        localField: 'PATIENT_ID',
                        foreignField: '_id',
                        as: 'PATIENT'
                    }
                },
                {
                    $unwind: '$PATIENT'
                },
                {
                    $project: {
                        'USER_CREATED': 0,
                        'USER_MODIFIED': 0,
                        'WORK_ID': 0,
                        'PATIENT_ID': 0,
                        'DEPARTMENT.createdAt': 0,
                        'DEPARTMENT.updatedAt': 0,
                        'PATIENT.DATE_CREATED': 0,
                        'PATIENT.DATE_MODIFIED': 0,
                        'PATIENT.__v': 0,
                        'DEPARTMENT.__v': 0,
                        'DOCTOR.DATE_CREATED': 0,
                        'DOCTOR.DATE_MODIFIED': 0,
                        'DOCTOR.__v': 0,
                        'DATE_CREATED': 0,
                        'DATE_MODIFIED': 0,
                        '__v': 0
                    }
                }
            ])
            return res.send({ error: false, data: data[0] })

        }
        if (key == '2') {
            let data_table =await lab_result.aggregate([
                {
                    $match: {
                        $and: [{ PATIENT_ID: ObjectID(PATIENT_ID) },
                        { 'DATE_TESTED': { $gte: startDate } }, { 'DATE_TESTED': { $lte: endDate } }
                        ]
                    }
                },
                {
                    $project : {
                        'LAB_NAME' : 1,
                        'LAB_GROUP_NAME' : 1,
                        'TEXT_VALUE' : 1,
                    }
                }
            ])

            let data = await lab_result.aggregate([
                {
                    $match: {
                        $and: [{ PATIENT_ID: ObjectID(PATIENT_ID) },
                        { 'DATE_TESTED': { $gte: startDate } }, { 'DATE_TESTED': { $lte: endDate } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'USER_TESTED',
                        foreignField: '_id',
                        as: 'USER_TESTED'
                    }
                },
                {
                    $unwind: '$USER_TESTED'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'USER_CREATED',
                        foreignField: '_id',
                        as: 'USER_CREATED'
                    }
                },
                {
                    $unwind: '$USER_CREATED'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'USER_APPROVED',
                        foreignField: '_id',
                        as: 'USER_APPROVED'
                    }
                },
                {
                    $unwind: '$USER_APPROVED'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'USER_REPORTED',
                        foreignField: '_id',
                        as: 'USER_REPORTED'
                    }
                },
                {
                    $unwind: '$USER_REPORTED'
                },
                // {
                //     $lookup: {
                //         from: 'departments',
                //         localField: 'DOCTOR.DEPART_ID',
                //         foreignField: '_id',
                //         as: 'DEPARTMENT'
                //     }
                // },
                // {
                //     $unwind: '$DEPARTMENT'
                // },
                {
                    $project: {
                        'USER_CREATED': 1,
                        'USER_REPORTED': 1,
                        'USER_APPROVED': 1,
                        'USER_TESTED': 1,
                        'DATE_TESTED': 1,
                       
                    }
                }
            ])
            return res.send({ error: false,data_table :data_table, data: data[0] })

        }
        if (key == '3') {
            const data = await xray_result.aggregate([
                {
                    $match: {
                        $and: [{ PATIENT_ID: ObjectID(PATIENT_ID) },
                        { 'DATE_REPORTED': { $gte: startDate } }, { 'DATE_REPORTED': { $lte: endDate } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'DOCTOR_REPORTED',
                        foreignField: '_id',
                        as: 'DOCTOR'
                    }
                },
                {
                    $unwind: '$DOCTOR'
                },
              
                {
                    $project: {
                        'USER_CREATED': 0,
                        'USER_MODIFIED': 0,
                        'DOCTOR.DATE_CREATED': 0,
                        'DOCTOR.DATE_MODIFIED': 0,
                        'DOCTOR.__v': 0,
                        'DATE_CREATED': 0,
                        'DATE_MODIFIED': 0,
                        '__v': 0
                    }
                },
                {
                    $addFields : {
                        'isExpanded' :false
                    }
                }
            ])
            return res.send({ error: false, data: data })

        }

    } catch (err) {
        return res.status(400)
    }

}








