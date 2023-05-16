const suggestion = require('../models/suggestion')
const { ObjectID } = require('bson');

exports.getAll = async (req, res) => {

    try {
        const data = await suggestion.find()
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
        const data =  await suggestion.aggregate([
            {
                $match : {PATIENT_ID : ObjectID(PATIENT_ID) }
            },
        ])
        return res.send({error : false,data : data})
    } catch (err) {
        return res.status(400)
    }
};

exports.adddata = async (req, res) => {
    let { comment, score, PATIENT_ID } = req.body
    try {

        const addSuggestion = await suggestion.create({ comment, score, PATIENT_ID })
        return res.send({ error: false, message: 'Created', data: addSuggestion })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, comment, score, PATIENT_ID } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const suggestion_data = await suggestion.findOne({ _id })
        suggestion_data.comment = comment ?? suggestion_data.comment
        suggestion_data.score = score ?? suggestion_data.score
        suggestion_data.PATIENT_ID = PATIENT_ID ?? suggestion_data.PATIENT_ID
        suggestion_data.DATE_MODIFIED = Date.now()
        await suggestion_data.save()
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
        const suggestion_data = await suggestion.deleteOne({ _id: id })
        if (suggestion_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};