const mongoose = require('mongoose')

const reportTypeSchema = new mongoose.Schema({
    reportTypeName : {type : String,required : true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('report_type',reportTypeSchema)


