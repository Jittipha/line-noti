const mongoose = require('mongoose')

const patientDrugAllerrgiesSchema = new mongoose.Schema({
    ALEVEL : {type : String,required : true},
    GENERIC : {type : String,required : true},
    HN : {type : String,required : true},
    INFORMANT : {type : String,required : true},
    INFORMHOSP : {type : String},
    INFORMUSER : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    LOCK_FLAG : {type : String},
    OTHER_SYMPTOM : {type : String},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    RUN_HN : {type : String},
    SYMPTOM : {type : String},
    TYPEDX : {type : String},
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

module.exports = mongoose.model('patient_drug_allergie',patientDrugAllerrgiesSchema)


