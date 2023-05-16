const mongoose = require('mongoose')

const statusPaymentSchema = new mongoose.Schema({
    statusName : {type : String,requied : true} ,
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

module.exports = mongoose.model('status_payment',statusPaymentSchema)