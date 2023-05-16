
const mongoose = require('mongoose')

const sypmtonSchema = new mongoose.Schema({
    SYMPTON : {type : String,requied : true} ,
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

module.exports = mongoose.model('sympton',sypmtonSchema)