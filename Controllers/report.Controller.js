const report = require('../models/report')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await report.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};



exports.getByPatient = async (req, res) => {
    let PATIENT_ID = req.params.id
    try {
        if(!PATIENT_ID){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const data = await report.aggregate([
            {
                $match : {PATIENT_ID : ObjectID(PATIENT_ID) }
            },
        ])
        console.log(data)
        return res.send({error : false,data : data})
    } catch (err) {
        return res.status(400)
    }
};

exports.adddata = async (req, res) => {
    let { reportType, description, PATIENT_ID } = req.body
    try {
        if(!reportType ||! description ||!PATIENT_ID || !req.file){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let filename = req.file.filename
        const addReport= await report.create({ reportType, description,image : filename, PATIENT_ID })
        return res.send({ error: false, message: 'Created', data: addReport })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, reportType, description,image, PATIENT_ID } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const report_data = await report.findOne({ _id })
        report_data.reportType = reportType ?? report_data.reportType
        report_data.description = description ?? report_data.description
        report_data.image = image ?? report_data.image
        report_data.PATIENT_ID = PATIENT_ID ?? report_data.PATIENT_ID
        report_data.DATE_MODIFIED = Date.now()
        await report_data.save()
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
        const report_data = await report.deleteOne({ _id: id })
        if (report_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};