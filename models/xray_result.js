const mongoose = require('mongoose')

const xrayResultSchema = new mongoose.Schema({
    XRAY_NAME: { type: String ,required : true},//
    ACCESSION_NO: { type: String },
    AGE: { type: String,required : true  },
    AN: { type: String },
    CONCEAL: { type: String },
    DATE_APPROVED: { type: Date   },
    DATE_REPORTED: { type: Date ,required : true  },
    GENDER: { type: String ,required : true  },
    HN: { type: String,required : true },
    IMPRESSION: { type: String },
    MWLWL_KEY: { type: String },
    ORDER_DATE: { type: Date  ,required : true },
    ORDER_ID: { type: String  ,required : true },
    ORDER_TIME: { type: String ,required : true},
    READING_TEXT: { type: String },
    REMARK: { type: String },
    REPORTWL_KEY: { type: String },
    RUN_AN: { type: String },
    RUN_HN: { type: String },
    STATUS: { type: String },
    STUDY_CASE_FLAG: { type: String },
    XRAY_ORDER_CODE: { type: String },
    YEAR_AN: { type: String },
    YEAR_HN: { type: String,required : true },
    DOCTOR_REPORTED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
    USER_APPROVED: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    USER_CREATED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
    USER_MODIFIED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
    // FINANCE_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'main_personal', requied: true },
    PATIENT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'main_personal', requied: true },
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

module.exports = mongoose.model('xray_result', xrayResultSchema)


