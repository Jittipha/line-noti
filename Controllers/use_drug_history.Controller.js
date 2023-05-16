const { ObjectID } = require('bson');
const finance = require('../models/finance')
const patient_drug_allergies = require('../models/patient_drug_allergies')
const patient_drug_allergies_group = require('../models/patient_drug_allergies_group')
const patient_food_allergies = require('../models/patient_food_allergies')
const patient_health = require('../models/patient_health')

exports.getAll_Drug = async (req, res) => {
    let { PATIENT_ID, SORT, TEXT_SEARCH } = req.body
    try {
        if (!SORT) {
            SORT = -1
        }
        else {
            SORT = parseInt(SORT)
        }
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data = await finance.aggregate([
            {
                $match: {
                    $and: [{ PATIENT_ID: ObjectID(PATIENT_ID) }, { 'FINANCE_TYPE': { $eq: 'D' } }]

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
            }
            , {
                $group: {
                    _id: '$GENERIC',
                    total: { $sum: "$QUANTITY" },
                    doctor: { $push: { $concat: ["$DOCTOR.PRE_NAME", " ", "$DOCTOR.FIRST_NAME", " ", "$DOCTOR.LAST_NAME"] } },

                }
            },
            {
                $match: {
                    $or: [
                        {
                            '_id': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                        {
                            'doctor': {
                                $regex: TEXT_SEARCH,
                                // $options: "i"
                            }
                        },
                    ]
                }
            },
            {
                $sort: {
                    "total": SORT
                }
            }
        ])

        return res.send({ error: false, data: data })
    } catch (err) {
        return res.status(400)
    }
};

// exports.getByDrug = async (req, res) => {
//     let { DRUG } = req.params
//     try {
//         console.log(DRUG)
//         if (!DRUG) {
//             return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
//         }
//         const data = await finance.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         { 'GENERIC': { $eq: DRUG } },
//                         { 'FINANCE_TYPE': { $eq: 'D' } }
//                     ]

//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'DOCTOR',
//                     foreignField: '_id',
//                     as: 'DOCTOR'
//                 }
//             },
//             {
//                 $unwind: '$DOCTOR'
//             },
//             {
//                 $lookup: {
//                     from: 'departments',
//                     localField: 'DOCTOR.DEPART_ID',
//                     foreignField: '_id',
//                     as: 'DEPART'
//                 }
//             },
//             {
//                 $unwind: '$DEPART'
//             }
//             ,{
//                 $group : {
//                     _id : '$GENERIC',
//                     total : {$sum : "$QUANTITY"},
//                     data : { $first : {'GENERIC' : '$GENERIC', 'DRUG_WARNING' : '$DRUG_WARNING', 'DRUG_USING' : '$DRUG_USING', 'DRUG_TIMING' : '$DRUG_TIMING','DRUG_PROPERTY' : '$DRUG_PROPERTY'}},
//                     doctor : {$push :{"PRE_NAME" :"$DOCTOR.PRE_NAME", "FIRST_NAME": "$DOCTOR.FIRST_NAME", "LAST_NAME" : "$DOCTOR.LAST_NAME","DEPART_NAME" : ""}},
//                 }
//             }
//         ])

//         return res.send({error : false,data : data})
//     } catch (err) {
//         return res.status(400)
//     }
// };
exports.getByDrug = async (req, res) => {
    let { PATIENT_ID, DRUG } = req.body
    try {
        if (!PATIENT_ID || !DRUG) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data = await finance.aggregate([
            {
                $match: {
                    $and: [
                        { PATIENT_ID: ObjectID(PATIENT_ID) },
                        { 'GENERIC': { $eq: DRUG } },
                        { 'FINANCE_TYPE': { $eq: 'D' } }
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
                    as: 'DEPART'
                }
            },
            {
                $unwind: '$DEPART'
            }
            , {
                $group: {
                    _id: '$GENERIC',
                    total: { $sum: "$QUANTITY" },
                    drug_data: { $first: { 'GENERIC': '$GENERIC', 'DRUG_WARNING': '$DRUG_WARNING', 'DRUG_USING': '$DRUG_USING', 'DRUG_TIMING': '$DRUG_TIMING', 'DRUG_PROPERTY': '$DRUG_PROPERTY' } },
                    history: { $push: { "ORDER_DATE": "$ORDER_DATE", "QUANTITY": "$QUANTITY", "DOCTOR": { "PRE_NAME": "$DOCTOR.PRE_NAME", "FIRST_NAME": "$DOCTOR.FIRST_NAME", "LAST_NAME": "$DOCTOR.LAST_NAME", "DEPART_NAME": "$DEPART.departmentName" } } },
                }
            }
        ])

        return res.send({ error: false, data: data })
    } catch (err) {
        return res.status(400)
    }
};

exports.get_patient_allergies = async (req, res) => {
    let { PATIENT_ID, TYPE } = req.body
    try {
        if (!PATIENT_ID || !TYPE) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if (TYPE == '1') {
            patient_drug_allergies.aggregate([
                {
                    $match: {
                        PATIENT_ID: ObjectID(PATIENT_ID),
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'INFORMUSER',
                        foreignField: '_id',
                        as: 'INFORMUSER'
                    }
                },
                {
                    $unwind: '$INFORMUSER'
                },
                {
                    $sort: {
                        GENERIC: 1
                    }
                },
                {
                    $addFields: { 'isExpanded': false }
                },
            ]).exec((err, data) => {
                if (err) throw err
                return res.send({ error: false, data: data })
            })
        }
        else if (TYPE == '2') {
            patient_drug_allergies_group.aggregate([
                {
                    $match: {
                        PATIENT_ID: ObjectID(PATIENT_ID),
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'INFORMUSER',
                        foreignField: '_id',
                        as: 'INFORMUSER'
                    }
                },
                {
                    $unwind: '$INFORMUSER'
                },
                {
                    $sort: {
                        GENERIC_GROUP: 1
                    }
                },
                {
                    $addFields: { 'isExpanded': false }
                },
            ]).exec((err, data) => {
                if (err) throw err
                return res.send({ error: false, data: data })
            })
        }
        else {
            patient_food_allergies.aggregate([
                {
                    $match: {
                        PATIENT_ID: ObjectID(PATIENT_ID),
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'INFORMUSER',
                        foreignField: '_id',
                        as: 'INFORMUSER'
                    }
                },
                {
                    $unwind: '$INFORMUSER'
                },
                // {
                //     $project: {
                //         "_id": 1,
                //         "ALEVEL": 1,
                //         "GENERIC": 1,
                //         "HN": 1,
                //         "INFORMANT": 1,
                //         "LOCK_FLAG": 1,
                //         "OTHER_SYMPTOM": 1,
                //         "PATIENT_ID": 1,
                //         "SYMPTOM": 1,
                //         "USER_CREATED": 1,
                //         "USER_MODIFIED": 1,
                //         "YEAR_HN": 1,
                //         "INFORMUSER.FULL_NAME": { $concat: ["$INFORMUSER.PRE_NAME", " ", "$INFORMUSER.FIRST_NAME", " ", "$INFORMUSER.LAST_NAME"] },
                //     }
                // },
                {
                    $sort: {
                        FOOD_NAME: 1
                    }
                },
                {
                    $addFields: { 'isExpanded': false }
                },
            ]).exec((err, data) => {
                if (err) throw err
                return res.send({ error: false, data: data })
            })
        }
    } catch (err) {
        return res.status(400)
    }
};

exports.get_patient_health = async (req, res) => {
    let PATIENT_ID = req.params.id
    try {
        if (!PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        patient_health.aggregate([
            {
                $match: {
                    PATIENT_ID: ObjectID(PATIENT_ID),
                }
            },
            {
                $group: {
                    _id: '$DISEASE_TYPE',
                    NAME: { $push: '$DISEASE_NAME' }
                }
            }, {
                $sort: {
                    _id: 1
                }
            }
        ]).exec((err, data) => {
            if (err) throw err
            return res.send({ error: false, data: data })
        })

    } catch (err) {
        return res.status(400)
    }
};
