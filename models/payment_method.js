const mongoose = require('mongoose')

const paymentMethodSchema = new mongoose.Schema({
    methodName : {type : String,requied : true} ,
    imagePath : {type : String,requied : true} ,
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

module.exports = mongoose.model('payment_method',paymentMethodSchema)