const mongoose = require('mongoose')

const getServiceSchema = new mongoose.Schema({
    serviceType : {type : String,requied : true} ,
    serviceList : {type : [{name:String,link : String}],requied : true} ,
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

module.exports = mongoose.model('get_service',getServiceSchema)