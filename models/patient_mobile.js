const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const { TimeSeriesReducers } = require("redis");

const patientMobileSchema = new mongoose.Schema({
  PATIENT_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "main_personal",
    required: true,
  },
  identificationNumber: { type: String, required: true },
  password: { type: String, required: true },
  connectLine: { type: String },
  accessTokenLine: { type: String },
  imageProfile: { type: String },
  imageIDcard: { type: String },
  ipAddress: { type: String, required: true },
  pdpaFlag: { type: String, required: true },
  status: { type: String, required: true },
  token_device: { type: String },
  logoutFlag: { type: String },
  passwordUpdated: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("patient_mobile", patientMobileSchema);

// const model =  mongoose.model('personal',personalSchema)
// const object =  model()
// object.save(function(err,doc ){
//     if(err) console.log(err)
// })

// personalSchema.path('identificationNumber').validate(function(identificationNumber) {
//     return identificationNumber && identificationNumber.length === 13;
// },console.log('identificationNumber code must be 13 characters') );
