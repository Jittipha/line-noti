const mongoose = require('mongoose')

const typeCreditCardSchema = new mongoose.Schema({
    typeName : {type : String,requied : true} ,
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

module.exports = mongoose.model('type_creditcard',typeCreditCardSchema)