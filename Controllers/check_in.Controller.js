const opd_right = require('../models/opd_right')
const appoint = require('../models/appoint')
const queue = require('../models/queue')
const queue_list = require('../models/queue_list')
const moment = require('moment')
const { ObjectID } = require('bson')
const { listenerCount } = require('../models/opd_right')


exports.getdata_queue = async (req, res) => {

    try {

        const queue_data = await queue.find()
        return res.send({ error: false, data: queue_data })

    } catch (err) {
        return res.status(400)
    }
};



exports.getdata_queue_by_id = async (req, res) => {
    let _id = req.params.id
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const queue_data = await queue.aggregate([
            {
                $match: {
                    _id: ObjectID(_id)
                }
            },
            {
                $lookup: {
                    from: 'rights',
                    localField: 'RIGHT_ID',
                    foreignField: '_id',
                    as: 'right'
                }
            },
            {
                $unwind: '$right'
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'DEPART_ID',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: '$department'
            },
            {
                $project: {
                    'right.USER_CREATED': 0,
                    'right.DATE_CREATED': 0,
                    'right.DATE_MODIFIED': 0,
                    'right.__v': 0,
                    'department.updatedAt': 0,
                    'department.createdAt': 0,
                    'department.__v': 0,
                    'PATIENT_ID': 0,
                    'DEPART_ID': 0,
                    'RIGHT_ID': 0,
                    'createdAt': 0,
                    'updatedAt': 0,
                    'statutsUpdatedAt': 0,
                    '__v': 0
                }
            }

        ])
        return res.send({ error: false, data: queue_data[0] })

    } catch (err) {
        return res.status(400)
    }
};

exports.get_queue_card = async (req, res) => {
    let _id = req.params.id
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let queue_data = await queue.aggregate([
            {
                $match: {
                    _id: ObjectID(_id)
                }
            },
            {
                $lookup: {
                    from: 'rights',
                    localField: 'RIGHT_ID',
                    foreignField: '_id',
                    as: 'right'
                }
            },
            {
                $unwind: '$right'
            },
            {
                $lookup: {
                    from: 'appoints',
                    localField: 'APPOINT_ID',
                    foreignField: '_id',
                    as: 'appoint'
                }
            },
            {
                $unwind: '$appoint'
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'DEPART_ID',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: '$department'
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'PATIENT_ID',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $unwind: '$patient'
            },
            {
                $project: {
                    'appoint.DATE_CREATED': 0,
                    'appoint.DATE_MODIFIED': 0,
                    'appoint.__v': 0,
                    'right.USER_CREATED': 0,
                    'right.DATE_CREATED': 0,
                    'right.DATE_MODIFIED': 0,
                    'right.__v': 0,
                    'patient.ID_CARD': 0,
                    'patient.DATE_CREATED': 0,
                    'patient.DATE_MODIFIED': 0,
                    'patient.__v': 0,
                    'department.updatedAt': 0,
                    'department.createdAt': 0,
                    'department.__v': 0,
                    'DEPART_ID': 0,
                    'PATIENT_ID': 0,
                    'RIGHT_ID': 0,
                    'statutsUpdatedAt': 0,
                    '__v': 0
                }
            }

        ])
        const create_date = new Date(queue_data[0].createdAt)
        const startOfday = moment(create_date).startOf('day').toDate()
        const endOfday = moment(create_date).endOf('day').toDate()
        const get_count_queue_in_date = await queue.aggregate([
            {
                $match: {
                    $and: [
                        {
                            DEPART_ID: ObjectID(queue_data[0].department._id)
                        },
                        {
                            'createdAt': { $gte: startOfday }
                        },
                        {
                            'createdAt': { $lte: endOfday }
                        },
                        {
                            'statutsUpdatedAt': { $lt: create_date }
                        },
                        {
                            'status': { $eq: 'W' }
                        },

                    ]
                }
            }
        ])
        queue_data[0].COUNT_QUEUE = get_count_queue_in_date.length
        queue_data[0].AVG_WAITING_TIME = get_count_queue_in_date.length * queue_data[0].appoint.DURATION
        return res.send({ error: false, data: queue_data[0] })

    } catch (err) {
        return res.status(400)
    }
};



exports.check_appoint = async (req, res) => {
    let PATIENT_ID = req.params.PATIENT_ID
    let DATE = req.params.DATE

    try {
        if (!PATIENT_ID || !DATE) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const startOfday = moment(DATE).startOf('day').toDate()
        const endOfday = moment(DATE).endOf('day').toDate()
        a = new Date(DATE)
        const HOUR = a.getHours()
        appoint.aggregate([
            {
                $match: {
                    $and: [
                        {
                            PATIENT_ID: ObjectID(PATIENT_ID)
                        },
                        {
                            'APPOINT_DATE': { $gte: startOfday }
                        },
                        {
                            'APPOINT_DATE': { $lte: endOfday }
                        },
                        {
                            'CONFIRM_STATUS': { $eq: "" }
                        },
                    ]
                }
            }
        ]).exec(async (err, data) => {
            if (err) {
                console.log(err)
                return res.send({ error: true, message: err })
            }
            if (data.length == 0) {
                return res.send({ error: true, message: 'empty' })
            }
            for (let x = 0; x < data.length; x++) {
                let starttime = parseInt(data[x].START_TIME.split('.')[0])
                let endtime = parseInt(data[x].END_TIME.split('.')[0])
                if (starttime <= HOUR && endtime > HOUR) {
                    let data_right = await opd_right.aggregate([
                        {
                            $match: {
                                $and: [
                                    {
                                        PATIENT_ID: ObjectID(PATIENT_ID)
                                    },
                                    {
                                        'CONFIRM': { $gte: 'Y' }
                                    },

                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'rights',
                                localField: 'RIGHT_ID',
                                foreignField: '_id',
                                as: 'right'
                            }
                        },
                        {
                            $unwind: '$right'
                        },
                        {
                            $project: {
                                'right.USER_CREATED': 0,
                                'right.DATE_CREATED': 0,
                                'right.DATE_MODIFIED': 0,
                                'right.__v': 0,
                                'CONFIRM': 0,
                                'RIGHT_ID': 0,
                                'HN': 0,
                                'PATIENT_ID': 0,
                                'USER_COMFIRM': 0,
                                'USER_CREATED': 0,
                                'DATE_CREATED': 0,
                                'DATE_MODIFIED': 0,
                                '__v': 0
                            }
                        }

                    ])
                    data_right[0].APPOINT_ID = data[x]._id
                    return res.send({ error: false, data: data_right[0] })
                }
            }
            return res.send({ error: true, message: 'empty' })
        })

    } catch (err) {
        return res.status(400)
    }
};

exports.add_queue = async (req, res) => {

    let { PATIENT_ID, APPOINT_ID, RIGHT_ID } = req.body
    let DOCTOR, DEPART_ID
    console.log()
    try {
        if (!PATIENT_ID || !APPOINT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data_appoint = await appoint.findOne({ _id: APPOINT_ID })
        data_appoint.CONFIRM_STATUS = 'F'
        data_appoint.DATE_MODIFIED = new Date()
        await data_appoint.save()
        if (data_appoint.DOCTOR != null) {
            DOCTOR = data_appoint.DOCTOR
            DEPART_ID = data_appoint.DEPART_ID
        } else {
            DEPART_ID = '64254b7a02e10121fecc0852'
        }
        const add_queue = await queue.create({ PATIENT_ID, APPOINT_ID, DEPART_ID, DOCTOR, queueNumber: 'A333', checkinType: 'A', appointFlag: 'Y', CHANNEL: '3', RIGHT_ID, status: 'W' })
        const add_queue_list = await queue_list.create({orNumber : '1',status : 'W',DEPART_ID,QUEUE_ID : add_queue._id,APPOINT_ID })
        return res.send({ error: false, message: 'Created', QUEUE_ID: add_queue._id })


    } catch (err) {
        return res.status(400)
    }
};

exports.getdata_queue_list = async (req, res) => {

    let QUEUE_ID = req.params.id;
    try {
        if (!QUEUE_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let queue_list_data = await queue_list.aggregate([
            {
                $match: {
                    QUEUE_ID: ObjectID(QUEUE_ID)
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'DEPART_ID',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: '$department'
            },
            {
                $lookup: {
                    from: 'appoints',
                    localField: 'APPOINT_ID',
                    foreignField: '_id',
                    as: 'appoint'
                }
            },
            {
                $unwind: '$appoint'
            },
            {
                $lookup: {
                    from: 'work_places',
                    localField: 'appoint.WORK_ID',
                    foreignField: '_id',
                    as: 'work_place'
                }
            },
            {
                $unwind: '$work_place'
            },
            {
                $lookup: {
                    from: 'buildings',
                    localField: 'work_place.BUILDING_ID',
                    foreignField: '_id',
                    as: 'building'
                }
            },
            {
                $unwind: '$building'
            },
            {
                $addFields: {
                    'isExpanded': false
                }
            }
        ])

       
        for(let x = 0 ;x < queue_list_data.length;x++){
            const startOfday = moment(queue_list_data[x].createdAt).startOf('day').toDate()
            const endOfday = moment(queue_list_data[x].createdAt).endOf('day').toDate()
            const get_count_waiting_queue = await queue.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                DEPART_ID: ObjectID(queue_list_data[0].DEPART_ID)
                            },
                            {
                                'createdAt': { $gte: startOfday }
                            },
                            {
                                'createdAt': { $lte: endOfday }
                            },
                            {
                                'status': { $eq: 'W' }
                            },
    
                        ]
                    }
                }
            ])

            const get_count_all_queue = await queue.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                DEPART_ID: ObjectID(queue_list_data[0].DEPART_ID)
                            },
                            {
                                'createdAt': { $gte: startOfday }
                            },
                            {
                                'createdAt': { $lte: endOfday }
                            },
                           
    
                        ]
                    }
                }
            ])

            const get_count_queue_in_date = await queue.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                DEPART_ID: ObjectID(queue_list_data[0].department._id)
                            },
                            {
                                'createdAt': { $gte: startOfday }
                            },
                            {
                                'createdAt': { $lte: endOfday }
                            },
                            {
                                'statutsUpdatedAt': { $lt: queue_list_data[x].createdAt }
                            },
                            {
                                'status': { $eq: 'W' }
                            },
    
                        ]
                    }
                }
            ])
            queue_list_data[x].COUNT_WAITING_QUEUE = get_count_waiting_queue.length
            queue_list_data[x].COUNT_ALL_QUEUE = get_count_all_queue.length
            queue_list_data[x].AVG_WAITING_TIME = get_count_queue_in_date.length * queue_list_data[0].appoint.DURATION
        }
       
        return res.send({ error: false, data: queue_list_data })

    } catch (err) {
        return res.status(400)
    }
};
// isExpanded
exports.delete_queue = async (req, res) => {

    let { id, APPOINT_ID } = req.body;
    try {
        if (!id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const appoint_data = await appoint.findOne({ _id: APPOINT_ID })
        appoint_data.CONFIRM_STATUS = ''
        appoint_data.DATE_MODIFIED = new Date()
        await appoint_data.save()
        const delete_queue_list = await queue_list.deleteMany({ QUEUE_ID: id })
        const delete_queue = await queue.deleteOne({ _id: id })
        if (delete_queue.deletedCount === 1 && delete_queue_list.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};