const mongoose = require('mongoose')

const labResultSchema = new mongoose.Schema({
    LAB_NAME: { type: String , requied: true },//
    LAB_GROUP_NAME :  { type: String , requied: true },//
    AGE: { type: String , requied: true },
    AN: { type: String },
    CONCEAL: { type: String },
    DATA_TYPE: { type: String },
    DATE_APPROVED: { type: Date },
    DATE_RECEIVED: { type: Date },
    DATE_REPORTED: { type: Date },
    DATE_TESTED: { type: Date , requied: true },
    GENDER: { type: String , requied: true},
    HIGH_CRITICAL_REF: { type: String },
    HN: { type: String, requied: true },
    LAB_ORDER_CODE: { type: String },
    LAB_RESULT_CODE: { type: String },
    LOW_CRITICAL_REF: { type: String },
    MAX_NUMBER_REF: { type: String },
    MAX_TEST_REF: { type: String },
    MIN_NUMBER_REF: { type: String },
    MIN_TEXT_REF: { type: String },
    NUMBER_VALUE: { type: String },
    ORDER_DATE: { type: Date , requied: true},
    ORDER_ID: { type: String, requied: true },
    ORDER_TIME: { type: String , requied: true},
    REMARK: { type: String },
    RESULT_VALUE: { type: String },
    RUN_AN: { type: String },
    RUN_HN: { type: String },
    SAMPLE_ID: { type: String },
    STATUS: { type: String },
    SUGGESTION: { type: String },
    SYMBOL: { type: String },
    TEXT_VALUE: { type: String },
    YEAR_AN: { type: String },
    YEAR_HN: { type: String , requied: true},
    USER_APPROVED: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    USER_CREATED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
    USER_MODIFIED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
    USER_RECEIVED: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    USER_REPORTED: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    USER_TESTED: { type: mongoose.Schema.Types.ObjectId, ref: 'user', requied: true },
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

module.exports = mongoose.model('lab_result', labResultSchema)


