const mongoose = require('mongoose')

const docExtraSchema = new mongoose.Schema({
    EXTRA_DATE : {type : Date,required : true},
    EXTRA_TYPE : {type : String,required : true},
    START_TIME : {type : String,required : true},
    END_TIME : {type : String,required : true},
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

module.exports = mongoose.model('doc_extra',docExtraSchema)


