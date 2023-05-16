const mongoose = require('mongoose')

const suggestionSchema = new mongoose.Schema({
    comment : {type : String,required : true},
    score : {type : String},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('suggestion',suggestionSchema)


