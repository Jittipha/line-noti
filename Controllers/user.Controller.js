const user = require('../models/user')
const services = require('../services/General_services')
const moment = require('moment')
const today = moment().startOf('day')
const { ObjectID } = require('bson')
const appoint = require('../models/appoint')
const personalController = require('./patient_mobile.Controller')
const doc_schedule = require('../models/doc_schedule')
const doc_extra = require('../models/doc_extra')


exports.getAll = async (req, res) => {

    try {
        const data = await user.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};
exports.getByDepart = async (req, res) => {
    let DEPART_ID = req.params.id
    try {
        if (!DEPART_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        user.find({ DEPART_ID: DEPART_ID }).select('_id POSITION PRE_NAME FIRST_NAME LAST_NAME').exec((err, data) => {
            if (err) {
                console.log(err)
                return res.send({ error: true, data: err })
            }
            if (data.length === 0) {
                return res.send({ error: false, data: [] })
            }
            return res.send({ error: false, data: data })

        })
    } catch (err) {
        return res.status(400)
    }
};


exports.getDocScheduleAndMyAppoint = async (req, res) => {
    let { _id, date, PATIENT_ID } = req.body
    let date_input
    try {
        if (!_id || !PATIENT_ID) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if (!date) {
            date_input = new Date()
        } else {
            date_input = new Date(date)
        }
        const startOfMonth = moment(date_input).startOf('month')
        const endOfMonth = moment(date_input).endOf('month')
        user.aggregate([
            {
                $match: {
                    _id: ObjectID(_id)
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
                    from: 'doc_schedules',
                    localField: '_id',
                    foreignField: 'DOCTOR',
                    pipeline: [{
                        $match: {
                            $and: [
                                {
                                    'END_DATE': { $gte: startOfMonth.toDate() }
                                },
                                {
                                    'START_DATE': { $lte: endOfMonth.toDate() }
                                }
                            ]
                        }
                    }],
                    as: 'schedule'
                }
            },
            {
                $lookup: {
                    from: 'doc_extras',
                    localField: '_id',
                    foreignField: 'DOCTOR',
                    pipeline: [{
                        $match: {
                            $and: [
                                {
                                    'EXTRA_DATE': { $gte: startOfMonth.toDate() }
                                },
                                {
                                    'EXTRA_DATE': { $lte: endOfMonth.toDate() }
                                },
                            ]
                        }
                    }],
                    as: 'extra'
                }
            },
            {
                $project: {
                    'DEPART_ID': 0,
                    'department.createdAt': 0,
                    'department.updatedAt': 0,
                    'department.__v': 0,
                    'extra.DATE_CREATED': 0,
                    'extra.__v': 0,
                    'extra.DATE_MODIFIED': 0,
                    'DATE_CREATED': 0,
                    'DATE_MODIFIED': 0,
                    '__v': 0,
                }
            }
        ]).exec(async (err, data) => {
            if (err) {
                console.log(err)
                return res.send({ error: true, data: err })
            }
            let AllDate_data = []
            const year_input = date_input.getFullYear()
            const month_input = date_input.getMonth()
            let startDateofMonth = new Date(year_input, month_input, 1);
            let startDateofMonth_converted = new Date(startDateofMonth + 'Z')
            let endDate0fMonth = new Date(year_input, month_input + 1, 1)
            let endDate0fMonth_converted = new Date(endDate0fMonth + 'Z')
            for (let x = 0; x < data[0].schedule.length; x++) {
                let dayOfWeek = data[0].schedule[x].DAY_OF_WEEK
                const END_DATE = data[0].schedule[x].END_DATE
                const LIMIT_CASE = data[0].schedule[x].LIMIT_CASE
                const _id_schedule = data[0].schedule[x]._id
                // console.log(data[0].schedule[x]); 
                // console.log('dayOfWeek : ' + dayOfWeek); // O
                let numOccurrences = services.numOccurrencesInMonth(year_input, month_input + 1, dayOfWeek)
                // console.log('numofDay : ' + numOccurrences); // O
                if (data[0].schedule[x].WEEK === 'A') {
                    for (let x = 0; x < numOccurrences; x++) {
                        let getDateMonth = services.getDateofMonth(year_input, month_input, x, dayOfWeek, startDateofMonth_converted, endDate0fMonth_converted)
                        if (getDateMonth.numOfloop == 1) {
                            numOccurrences = numOccurrences + 1
                        } else {
                            if (Math.sign(services.cal_diff_date(END_DATE, getDateMonth.date)) === 1) {
                                // console.log(getDateMonth.date)
                                const data_count_appoint = await getcount_appoint(getDateMonth.date, _id)
                                AllDate_data.push({ _id: [{ _id: _id_schedule, key: 'S' }], DATE: getDateMonth.date, LIMIT: LIMIT_CASE, COUNT_APPOINT: data_count_appoint })
                            }

                        }
                    }
                }
                if (data[0].schedule[x].WEEK === '1') {

                }
                if (data[0].schedule[x].WEEK === '2') {

                }
                if (data[0].schedule[x].WEEK === '3') {

                }
                if (data[0].schedule[x].WEEK === '4') {

                }
                if (data[0].schedule[x].WEEK === 'L') {

                }



            }
            for (let a = 0; a < data[0].extra.length; a++) {
                const _id_extra = data[0].extra[a]._id
                const EXTRA_DATE = data[0].extra[a].EXTRA_DATE
                const LIMIT_CASE = data[0].extra[a].LIMIT_CASE
                const data_count_appoint = await getcount_appoint(EXTRA_DATE, _id)
                AllDate_data.push({ _id: [{ _id: _id_extra, key: 'E' }], DATE: EXTRA_DATE, LIMIT: LIMIT_CASE, COUNT_APPOINT: data_count_appoint })
            }

            let list_index_compare = []
            const list_compare = [];
            var alreadySeen = {};
            const listdate_compare = AllDate_data.map(x => x.DATE)
            listdate_compare.forEach(function (str, index) {
                if (alreadySeen[str])
                    list_index_compare.push(index),
                        list_compare.push(AllDate_data[index]);
                else
                    alreadySeen[str] = true
            });
            for (let a = 0; a < list_index_compare.length; a++) {
                for (let x = AllDate_data.length - 1; x >= 0; x--) {
                    const date1 = new Date(AllDate_data[x].DATE)
                    const date2 = new Date(list_compare[a].DATE)
                    if (Math.sign(services.cal_diff_date(date2, date1)) === 0) {
                        if (x != list_index_compare[a]) {
                            list_compare[a].LIMIT = list_compare[a].LIMIT + AllDate_data[x].LIMIT
                            let list_id = list_compare[a]._id
                            list_id.push(AllDate_data[x]._id[0])
                            list_compare[a] = { _id: list_id, DATE: list_compare[a].DATE, LIMIT: list_compare[a].LIMIT, COUNT_APPOINT: list_compare[a].COUNT_APPOINT }
                        }
                        AllDate_data.splice(x, 1)
                    }
                }
                AllDate_data.push(list_compare[a])
            }
            const data_patient_appoint = await personalController.getMyappoint_Upcoming(PATIENT_ID, startOfMonth, endOfMonth)
            const doc_data = {
                "_id": data[0]._id, "POSITION": data[0].POSITION,
                "PRE_NAME": data[0].PRE_NAME,
                "FIRST_NAME": data[0].FIRST_NAME,
                "LAST_NAME": data[0].LAST_NAME
            }
            for(let x= 0 ; x < data_patient_appoint.length; x++){
                AllDate_data.push({DATE : data_patient_appoint[x]['APPOINT_DATE'],TYPE : 'AP'})
            }
            return res.send({ error: false, data: { doc_data: doc_data, schedule: AllDate_data } })
        })
    } catch (err) {
        return res.status(400)
    }
};

async function getcount_appoint(date, Doctor_ID) {
    try {
        const data = await appoint.aggregate([
            {
                $match: {

                    $and: [{ DOCTOR: ObjectID(Doctor_ID) }, { APPOINT_DATE: date }]
                }
            },
            {
                $project: {
                    'DATE_CREATED': 0,
                    'DATE_MODIFIED': 0,
                    '__v': 0,
                }
            }

        ])
        return data.length
    } catch (err) {
        throw err
    }
}


exports.get_period = async (req, res) => {
    let { arrid, date } = req.body
    let Alldata = [];
    try {
        if (!arrid || !date) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let arry = JSON.parse(arrid)
    const date_convert = new Date(date)

        for (let a = 0; a < arry.length; a++) {
            let data
            if (arry[a].key == 'S') {
                data = await doc_schedule.findOne({ _id: arry[a]._id })
            } else {
                data = await doc_extra.findOne({ _id: arry[a]._id })
            }
            let data_appoint = await appoint.find({ APPOINT_DATE: date_convert, START_TIME: data.START_TIME, END_TIME: data.END_TIME })
            Alldata.push({ data: data, count_appoint: data_appoint.length })
        }

        return res.send({ error: false, data: Alldata })
    } catch (err) {
        throw err
    }
}

// exports.get_period_by_date = async (req, res) => {
//     let { DOCTOR,date } = req.body

//     try {
//         if (!DOCTOR ||!date) {
//             return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
//         }
//         const date_start = moment(new Date(date)).startOf('day').toDate()
//         const date_end = moment(new Date(date)).endOf('day').toDate()
//         const data =await doc_schedule.aggregate([
//             {
//                 $match: {
//                     $and: [
//                       {
//                         DOCTOR: ObjectID(DOCTOR)
//                       },
//                       {
//                         'APPOINT_DATE': { $gte: date_start }
//                       },
//                       {
//                         'APPOINT_DATE': { $lte: date_end }
//                       },

//                     ]
//                   }
//             },
//         ])

//         return res.send({ error: false, data: data })
//     } catch (err) {
//         throw err
//     }
// }





exports.adddata = async (req, res) => {

    let { DEPART_ID, POSITION, PRE_NAME, FIRST_NAME, LAST_NAME } = req.body
    try {
        if (!DEPART_ID || !POSITION || !PRE_NAME || !FIRST_NAME || !LAST_NAME) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }

        const addUser = await user.create({ DEPART_ID, POSITION, PRE_NAME, FIRST_NAME, LAST_NAME })
        return res.send(addUser)

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, DEPART_ID, POSITION, PRE_NAME, FIRST_NAME, LAST_NAME } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }

        const user_data = await user.findOne({ _id })
        user_data.DEPART_ID = DEPART_ID ?? user_data.DEPART_ID
        user_data.POSITION = POSITION ?? user_data.POSITION
        user_data.PRE_NAME = PRE_NAME ?? user_data.PRE_NAME
        user_data.FIRST_NAME = FIRST_NAME ?? user_data.FIRST_NAME
        user_data.LAST_NAME = LAST_NAME ?? user_data.LAST_NAME
        user_data.DATE_MODIFIED = Date.now()
        await user_data.save()
        return res.send(user_data)

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
        const user_data = await user.deleteOne({ _id: id })
        if (user_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};