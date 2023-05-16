const mongoose = require('mongoose')

const patientHealthSchema = new mongoose.Schema({
    DISEASE_NAME : {type : String,required : true}, //
    DISEASE_TYPE : {type : String,required : true}, //
    HN : {type : String,required : true},
    INFORMANT : {type : String,required : true},
    INFORMHOSP : {type : String}, //
    INFORMUSER : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    RUN_HN : {type : String},
    USER_CREATED : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    USER_MODIFIED : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
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
module.exports = mongoose.model('patient_health',patientHealthSchema)


