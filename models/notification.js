const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    noti_id : {type : String , requied :true} ,
    type : {type : String , requied :true} ,
    datetime_noti : {type : Date , requied :true} ,
    title : {type : String , requied :true} ,
    body : {type : String , requied :true} ,
    title_en : {type : String , requied :true} ,
    body_en : {type : String , requied :true} ,
    status_read : {type : String , requied :true} ,
    status_send : {type : String , requied :true} ,
    PATIENT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'patient',requied : true},
    APPOINT_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'appoint',requied : true},
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

module.exports = mongoose.model('notification',notificationSchema)