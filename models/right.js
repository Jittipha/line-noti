const mongoose = require('mongoose')

const rightSchema = new mongoose.Schema({
    CASH_FLAG : {type : String},
    NAME : {type : String,required : true},
    E_NAME : {type : String,required : true},
    RIGHT_DESC : {type : String},
    USER_CREATED : {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    USER_MODIFIED: {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
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

module.exports = mongoose.model('right',rightSchema)


