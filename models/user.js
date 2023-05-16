const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    DEPART_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'department',requied : true},
    POSITION : {type :String,requied : true},
    PRE_NAME : {type : String,requied : true},
    FIRST_NAME : {type : String,requied : true},
    LAST_NAME : {type : String,requied : true},
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

module.exports = mongoose.model('user',userSchema)


