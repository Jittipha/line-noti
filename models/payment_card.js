const mongoose = require('mongoose')

const paymentCardSchema = new mongoose.Schema({
    bank_owner : {type : String,required : true},
    cardNumber : {type : String,required : true},
    cardHolderName : {type : String,required : true},
    cvvNumber : {type : String,required : true},
    expiryDate : {type : String,required : true},
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    typeofCreditCard : {type : String},
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

module.exports = mongoose.model('payment_card',paymentCardSchema)


