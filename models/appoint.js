const mongoose = require('mongoose')

const appointSchema = new mongoose.Schema({
    APPOINT_DATE : {type : Date,required : true},
    APPOINT_TYPE : {type : String,required : true},
    APPOINT_STATUS : {type : String},
    CONFIRM_STATUS : {type : String},
    START_TIME : {type : String},
    END_TIME : {type : String},
    HN : {type : String,required : true},
    DURATION : {type : Number},
    IMAGE : {type : String},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'main_personal',requied : true},
    DOCTOR : {type : mongoose.Schema.Types.ObjectId,ref  : 'user'},
    DEPART_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'department'},
    URGRNCY : {type :String},
    CANCEL_REASON : {type : mongoose.Schema.Types.ObjectId,ref  : 'cancel_reason'},
    SYMPTON : {type : mongoose.Schema.Types.ObjectId,ref  : 'sympton'},
    SYMPTON_REMARK : {type :String},
    WORK_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'work_place'},
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

module.exports = mongoose.model('appoint',appointSchema)


