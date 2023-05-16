
const mongoose = require('mongoose')

const cancelReasonSchema = new mongoose.Schema({
    REASON : {type : String,requied : true} ,
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

module.exports = mongoose.model('cancel_reason',cancelReasonSchema)