const mongoose = require('mongoose')

const  buildingSchema = new mongoose.Schema({
    NAME : {type : String,required : true},
    E_NAME : {type : String,required : true},
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date, 
        default: () => Date.now()
    },
    
})

module.exports = mongoose.model('building',buildingSchema)


