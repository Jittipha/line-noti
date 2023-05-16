const mongoose = require('mongoose')

const  queueListSchema = new mongoose.Schema({
    orNumber : {type : String},
    status : {type : String},
    DEPART_ID : {type : mongoose.Schema.Types.ObjectId,ref  : 'department'},
    QUEUE_ID: {type : mongoose.Schema.Types.ObjectId,ref  : 'queue'},
    APPOINT_ID: {type : mongoose.Schema.Types.ObjectId,ref  : 'appoint'},
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

module.exports = mongoose.model('queue_list',queueListSchema)


