const mongoose = require('mongoose')

const  queueSchema = new mongoose.Schema({
    queueNumber : {type : String,required : true},
    appointFlag : {type : String},
    checkinType : {type : String,required : true},
    interrogateFlag : {type : String},
    patientCancelFlag : {type : String},
    reasonAddRoom : {type : String},
    DEPART_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'department',required : true},
    DOCTOR: {type : mongoose.Schema.Types.ObjectId,ref  : 'user',requied : true},
    APPOINT_ID: {type : mongoose.Schema.Types.ObjectId,ref  : 'appoint',required : true},
    CHANNEL : {type : String},
    PATIENT_ID: {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',required : true},
    RIGHT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'right'},
    status: {type : String,required : true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date, 
        default: () => Date.now()
    },
    statutsUpdatedAt: {
        type: Date, 
        default: () => Date.now()
    }
})

module.exports = mongoose.model('queue',queueSchema)


