const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    amount  : {type : String,required : true} ,
    visitNo : {type : String,} ,
    receiptNumber : {type : String},
    refNumber : {type : String},
    dateofPaid : {type : Date},
    ORDER_ID : {type : String,required : true},
    PAYMENT_TYPE_DESC : {type : String,required : true},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    PAYMENT_CARD_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'payment_card',requied : true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    }
})

module.exports = mongoose.model('payment',paymentSchema)