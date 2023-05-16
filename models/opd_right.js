const mongoose = require('mongoose')

const opd_rightSchema = new mongoose.Schema({
    AMOUNT : {type : Number},
    APPROVAL_DATE : {type : Date},
    CLAIM : {type : Number},
    CONFIRM : {type : String},
    COPAY : {type : Number},
    DATE_CONFIRM : {type : Date},
    DISCOUNT : {type : Number},
    HN : {type : String,required : true},
    LIMIT : {type : Number},
    MAIN_FLAG : {type : String},
    PAYMENT : {type : Number},
    REMARK : {type : String},
    RUN_HN : {type : String},
    YEAR_HN : {type : String},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    USER_COMFIRM : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    USER_CREATED : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    USER_MODIFIED: {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    RIGHT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'right',requied : true},
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

module.exports = mongoose.model('opd_right',opd_rightSchema)


