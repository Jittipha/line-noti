const mongoose = require('mongoose')


const workPlaceSchema = new mongoose.Schema({
    DEPART_ID :  { type : mongoose.Schema.Types.ObjectId,ref  : 'department' ,required : true},
    BUILDING_ID :  { type : mongoose.Schema.Types.ObjectId,ref  : 'building' ,required : true},
    // BUILDING_ID :  { type : mongoose.Schema.Types.ObjectId,ref  : 'main_personal' ,required : true},
    CANCEL_FLAG : {type : String},
    E_NAME : {type : String,requied : true},
    NAME : {type : String,requied : true},
    NAME2 : {type : String},
    NAME3 : {type : String} ,
    PLACE_TYPE : {type : String,required : true} ,
    NOT_MEET_DR_FLAG : {type : String},
    NEED_DR_APPOINT_FLAG : {type : String},
    SPECIAL_APPOINT_FLAG : {type : String},
    DATE_CREATED: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    DATE_MODIFIED: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('work_place',workPlaceSchema)