const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
    departmentName : {type : String,requied : true} ,
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

module.exports = mongoose.model('department',departmentSchema)