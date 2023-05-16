const mongoose = require('mongoose')

const docScheduleSchema = new mongoose.Schema({
    CANCEL_FLAG : {type : String},
    DAY_OF_WEEK : {type : String,required : true},
    DURATION : {type : String,required : true},
    END_DATE : {type : Date,required : true},
    START_DATE : {type : Date,required : true},
    START_TIME : {type : String,required : true},
    END_TIME : {type : String,required : true},
    SEQ : {type : String,required : true},
    WEEK : {type : String,required : true},
    SCHEDULE_TYPE : {type : String,required : true},
    NEW_CASE : {type : Number,required : true},
    LIMIT_CASE : {type : Number,required : true},
    REMARK : {type : Number},
    DOCTOR : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    WORK_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'work_place',requied : true},
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

module.exports = mongoose.model('doc_schedule',docScheduleSchema)


