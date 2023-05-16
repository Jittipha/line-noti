const opd_clinic = require('../models/opd_clinic')
const finance = require('../models/finance')
const { ObjectID } = require('bson');
const moment = require('moment')
const service = require('../services/General_services')

exports.get_list_data = async (req, res) => {
    let {PATIENT_ID,SORT,TEXT_SEARCH} = req.body
    try {
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if(!SORT){
            SORT = -1
        }
        else{
            SORT = parseInt(SORT)
        }
         finance.aggregate([
            {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            CLINIC_ID: { $ne: null }
                        },
                       

                    ]
                }
            },
            {
                $lookup: {
                    from: 'opd_clinics',
                    localField: 'CLINIC_ID',
                    foreignField: '_id',
                    as: 'opd_clinic',
                   
                }
            },
            {
                $unwind: '$opd_clinic'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'opd_clinic.DOCTOR',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $unwind: '$doctor'
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'doctor.DEPART_ID',
                    foreignField: '_id',
                    as: 'department',
                   
                }
            },
            {
                $unwind: '$department'
            },
            {
                $project : {
                    'ORDER_DATE': 1,
                    'opd_clinic._id': 1,
                    'opd_clinic.SUGGESTION': 1,
                    'doctor._id': 1,
                    'doctor.POSITION': 1,
                    'doctor.PRE_NAME': 1,
                    'doctor.FIRST_NAME': 1,
                    'doctor.LAST_NAME': 1,
                    'department._id': 1,
                    'department.departmentName': 1,
                    'doctor.FULL_NAME': { $concat : [ "$doctor.PRE_NAME"," ","$doctor.FIRST_NAME"," ","$doctor.LAST_NAME"]},

                }
            },
            {
                $match: {
                    $or: [
                        {
                            'department.departmentName': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                        {
                            'doctor.FULL_NAME': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                    ]
                }
            },
           
           
            {
                $sort : {
                    ORDER_DATE :  SORT
                }
            }
        ]).exec((err,data)=>{
            if(err) throw err
            return res.send({ error: false, data: data })

        })
    } catch (err) {
        return res.status(400)
    }
};

