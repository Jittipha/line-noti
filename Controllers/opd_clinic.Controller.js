const opd_clinic = require('../models/opd_clinic')

exports.getAll = async (req, res) => {

    try {
      const data = await opd_clinic.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {AFTER_DR_DATE,AGE_DAY,AGE_MONTH,AGE_YEAR,BMI,BODY_TEMPERATURE,BP_DIASTOLIC,BP_SYSTOLIC,BP_TYPE,BPD_ARM_LT,BPD_ARM_RT,BPD_LEG_LT,BPD_LEG_RT,BPS_ARM_LT,BPS_ARM_RT,BPS_LEG_LT,BPS_LEG_RT,BSLEVEL,BSTEST,CHECKIN_DATE,CHECKOUT_DATE,CHIEF_COMPLAINT,CLINIC_DATE,DENTYPE,FINISH_SCREEN_DATE,FINISH_DATE,FINISH_FLAG,HEIGHT,HN,HTFAMILY,MEET_DR_DATE,NEW_OD_OPD_FLAG,PULSE,QUEUE_BRANCH,QUEUE_DATE,RESPTRATORY,RUN_HN,SCREENING_DATE,SMWT,VACCINE,WEIGHT,DOCTOR,USER_CREATED,USER_MODIFIED,WORK_ID,PATIENT_ID,SUGGESTION} = req.body
   try{ 
    if(!AFTER_DR_DATE ||!AGE_DAY ||!AGE_MONTH ||!AGE_YEAR ||! BMI||! BODY_TEMPERATURE||!BP_DIASTOLIC ||!BP_SYSTOLIC ||!CHIEF_COMPLAINT ||!CLINIC_DATE ||!FINISH_FLAG ||! HEIGHT ||!HN ||!HTFAMILY ||!PULSE ||!RESPTRATORY ||!WEIGHT ||!DOCTOR ||!USER_CREATED ||!USER_MODIFIED ||!WORK_ID ||! PATIENT_ID ||!SUGGESTION){
        return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addOpd_clinic = await opd_clinic.create({AFTER_DR_DATE,AGE_DAY,AGE_YEAR,AGE_MONTH,BMI,BODY_TEMPERATURE,BP_DIASTOLIC,BP_SYSTOLIC,BP_TYPE,BPD_ARM_LT,BPD_ARM_RT,BPD_LEG_LT,BPD_LEG_RT,BPS_ARM_LT,BPS_ARM_RT,BPS_LEG_LT,BPS_LEG_RT,BSLEVEL,BSTEST,CHECKIN_DATE,CHECKOUT_DATE,CHIEF_COMPLAINT,CLINIC_DATE,DENTYPE,FINISH_SCREEN_DATE,FINISH_DATE,FINISH_FLAG,HEIGHT,HN,HTFAMILY,MEET_DR_DATE,NEW_OD_OPD_FLAG,PULSE,QUEUE_BRANCH,QUEUE_DATE,RESPTRATORY,RUN_HN,SCREENING_DATE,SMWT,VACCINE,WEIGHT,DOCTOR,USER_CREATED,USER_MODIFIED,WORK_ID,PATIENT_ID,SUGGESTION})
    return res.send({error : false,message : 'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id,AFTER_DR_DATE,AGE_DAY,AGE_MONTH,AGE_YEAR,BMI,BODY_TEMPERATURE,BP_DIASTOLIC,BP_SYSTOLIC,BP_TYPE,BPD_ARM_LT,BPD_ARM_RT,BPD_LEG_LT,BPD_LEG_RT,BPS_ARM_LT,BPS_ARM_RT,BPS_LEG_LT,BPS_LEG_RT,BSLEVEL,BSTEST,CHECKIN_DATE,CHECKOUT_DATE,CHIEF_COMPLAINT,CLINIC_DATE,DENTYPE,FINISH_SCREEN_DATE,FINISH_DATE,FINISH_FLAG,HEIGHT,HN,HTFAMILY,MEET_DR_DATE,NEW_OD_OPD_FLAG,PULSE,QUEUE_BRANCH,QUEUE_DATE,RESPTRATORY,RUN_HN,SCREENING_DATE,SMWT,VACCINE,WEIGHT,DOCTOR,USER_CREATED,USER_MODIFIED,WORK_ID,PATIENT_ID,SUGGESTION} = req.body;
    try {
        if(!_id){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
       
        const opd_clinic_data = await opd_clinic.findOne({ _id })
        opd_clinic_data.AFTER_DR_DATE  = AFTER_DR_DATE ??  opd_clinic_data.AFTER_DR_DATE
        opd_clinic_data.AGE_DAY  = AGE_DAY ??  opd_clinic_data.AGE_DAY
        opd_clinic_data.AGE_MONTH  = AGE_MONTH ??  opd_clinic_data.AGE_MONTH
        opd_clinic_data.AGE_YEAR  = AGE_YEAR ??  opd_clinic_data.AGE_YEAR
        opd_clinic_data.BMI  = BMI ??  opd_clinic_data.BMI
        opd_clinic_data.BODY_TEMPERATURE  = BODY_TEMPERATURE ??  opd_clinic_data.BODY_TEMPERATURE
        opd_clinic_data.BP_DIASTOLIC  = BP_DIASTOLIC ??  opd_clinic_data.BP_DIASTOLIC
        opd_clinic_data.BP_SYSTOLIC  = BP_SYSTOLIC ??  opd_clinic_data.BP_SYSTOLIC
        opd_clinic_data.BP_TYPE  = BP_TYPE ??  opd_clinic_data.BP_TYPE
        opd_clinic_data.BPD_ARM_LT  = BPD_ARM_LT ??  opd_clinic_data.BPD_ARM_LT
        opd_clinic_data.BPD_ARM_RT  = BPD_ARM_RT ??  opd_clinic_data.BPD_ARM_RT
        opd_clinic_data.BPD_LEG_LT  = BPD_LEG_LT ??  opd_clinic_data.BPD_LEG_LT
        opd_clinic_data.BPD_LEG_RT  = BPD_LEG_RT ??  opd_clinic_data.BPD_LEG_RT
        opd_clinic_data.BPS_ARM_LT  = BPS_ARM_LT ??  opd_clinic_data.BPS_ARM_LT
        opd_clinic_data.BPS_ARM_RT  = BPS_ARM_RT ??  opd_clinic_data.BPS_ARM_RT
        opd_clinic_data.BPS_LEG_LT  = BPS_LEG_LT ??  opd_clinic_data.BPS_LEG_LT
        opd_clinic_data.BPS_LEG_RT  = BPS_LEG_RT ??  opd_clinic_data.BPS_LEG_RT
        opd_clinic_data.BSLEVEL  = BSLEVEL ??  opd_clinic_data.BSLEVEL
        opd_clinic_data.BSTEST  = BSTEST ??  opd_clinic_data.BSTEST
        opd_clinic_data.CHECKIN_DATE  = CHECKIN_DATE ??  opd_clinic_data.CHECKIN_DATE
        opd_clinic_data.CHECKOUT_DATE  = CHECKOUT_DATE ??  opd_clinic_data.CHECKOUT_DATE
        opd_clinic_data.CHIEF_COMPLAINT  = CHIEF_COMPLAINT ??  opd_clinic_data.CHIEF_COMPLAINT
        opd_clinic_data.CLINIC_DATE  = CLINIC_DATE ??  opd_clinic_data.CLINIC_DATE
        opd_clinic_data.DENTYPE  = DENTYPE ??  opd_clinic_data.DENTYPE
        opd_clinic_data.FINISH_SCREEN_DATE  = FINISH_SCREEN_DATE ??  opd_clinic_data.FINISH_SCREEN_DATE
        opd_clinic_data.FINISH_DATE  = FINISH_DATE ??  opd_clinic_data.FINISH_DATE
        opd_clinic_data.FINISH_FLAG  = FINISH_FLAG ??  opd_clinic_data.FINISH_FLAG
        opd_clinic_data.HEIGHT  = HEIGHT ??  opd_clinic_data.HEIGHT
        opd_clinic_data.HN  = HN ??  opd_clinic_data.HN
        opd_clinic_data.HTFAMILY  = HTFAMILY ??  opd_clinic_data.HTFAMILY
        opd_clinic_data.MEET_DR_DATE  = MEET_DR_DATE ??  opd_clinic_data.MEET_DR_DATE
        opd_clinic_data.NEW_OD_OPD_FLAG  = NEW_OD_OPD_FLAG ??  opd_clinic_data.NEW_OD_OPD_FLAG
        opd_clinic_data.PULSE  = PULSE ??  opd_clinic_data.PULSE
        opd_clinic_data.QUEUE_BRANCH  = QUEUE_BRANCH ??  opd_clinic_data.QUEUE_BRANCH
        opd_clinic_data.QUEUE_DATE  = QUEUE_DATE ??  opd_clinic_data.QUEUE_DATE
        opd_clinic_data.RESPTRATORY  = RESPTRATORY ??  opd_clinic_data.RESPTRATORY
        opd_clinic_data.RUN_HN  = RUN_HN ??  opd_clinic_data.RUN_HN
        opd_clinic_data.SCREENING_DATE  = SCREENING_DATE ??  opd_clinic_data.SCREENING_DATE
        opd_clinic_data.SUGGESTION  = SUGGESTION ??  opd_clinic_data.SUGGESTION
        opd_clinic_data.SMWT  = SMWT ??  opd_clinic_data.SMWT
        opd_clinic_data.VACCINE  = VACCINE ??  opd_clinic_data.VACCINE
        opd_clinic_data.WEIGHT  = WEIGHT ??  opd_clinic_data.WEIGHT
        opd_clinic_data.DOCTOR  = DOCTOR ??  opd_clinic_data.DOCTOR
        opd_clinic_data.USER_CREATED  = USER_CREATED ??  opd_clinic_data.USER_CREATED
        opd_clinic_data.USER_MODIFIED  = USER_MODIFIED ??  opd_clinic_data.USER_MODIFIED
        opd_clinic_data.WORK_ID  = WORK_ID ??  opd_clinic_data.WORK_ID
        opd_clinic_data.PATIENT_ID  = PATIENT_ID ??  opd_clinic_data.PATIENT_ID
        opd_clinic_data.DATE_MODIFIED = Date.now()
        await opd_clinic_data.save()
        return res.send({error : false,message : 'Updated'})
  
    } catch (err) {
        return res.status(400)
    }
  };
  exports.deleteOne = async (req, res) => {
  
    let id = req.params.id;
    try {
        if (!id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const opd_clinic_data = await opd_clinic.deleteOne({ _id: id })
        if (opd_clinic_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };