const mongoose = require('mongoose')

const telemedSchema = new mongoose.Schema({
    MEET_DATE : {type : String,required : true}, //
    HN : {type : String,required : true},
    LINK : {type : String,required : true},
    DOCTOR : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    RUN_HN : {type : String},
    YEAR_HN : {type : String},
    DATE_CREATED: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    DATE_MODIFIED: {
        type: Date,
        default: () => Date.now()
    }
})
module.exports = mongoose.model('telemed',telemedSchema)


