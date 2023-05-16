const mongoose = require('mongoose')
const { TimeSeriesReducers } = require('redis');


const patientSchema = new mongoose.Schema({
    ID_CARD : {type : String,required : true},
    HN : {type : String,requied : true} ,
    AGE_DAY :{type : Number,requied : true},
    AGE_MONTH :{type : Number,requied : true},
    AGE_YEAR :{type : Number,requied : true},
    GENDER :{type : String,requied : true},
    E_PRE_NAME : {type : String,required : true},
    E_FIRST_NAME : {type : String,required : true},
    E_LAST_NAME : {type : String,require :true},
    PRE_NAME : {type : String,require :true},
    FIRST_NAME : {type : String,required : true},
    LAST_NAME : {type : String,require :true},
    NICK_NAME : {type : String,require :true},
    BIRTHDATE : {type : Date ,required : true},
    LINEID : {type : String ,required : true},
    MOBILE : {type : String ,required : true},
    EMAIL: {type : String ,required : true},
    BLOODGROUP : {type : String ,required : true},
    YEAR_HN : {type : String ,required : true},
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

module.exports = mongoose.model('patient',patientSchema)

