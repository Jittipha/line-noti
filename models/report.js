const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    reportType : {type : mongoose.Schema.Types.ObjectId,ref  : 'report_type',requied : true},
    description : {type : String},
    image : {type : String,required : true},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
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

module.exports = mongoose.model('report',reportSchema)


