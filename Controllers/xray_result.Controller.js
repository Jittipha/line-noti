const xray_result = require('../models/xray_result')

exports.getAll = async (req, res) => {

    try {
      const data = await xray_result.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {XRAY_NAME,ACCESSION_NO,AGE,AN,CONCEAL,DATE_APPROVED,DATE_REPORTED,GENDER,HN,IMPRESSION,MWLWL_KEY,ORDER_DATE,ORDER_ID,ORDER_TIME,READING_TEXT,REMARK,REPORTWL_KEY,RUN_AN,RUN_HN,STATUS,STUDY_CASE_FLAG,XRAY_ORDER_CODE,YEAR_AN,YEAR_HN,DOCTOR_REPORTED,USER_APPROVED,USER_CREATED,USER_MODIFIED,PATIENT_ID} = req.body
   try{ 
    if(!XRAY_NAME||!DATE_REPORTED ||!GENDER ||!HN ||! ORDER_DATE||! ORDER_ID||!ORDER_TIME ||!YEAR_HN ||!DOCTOR_REPORTED ||!USER_CREATED ||!USER_MODIFIED ||! PATIENT_ID){
        return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addXray_result = await xray_result.create({XRAY_NAME,ACCESSION_NO,AGE,AN,CONCEAL,DATE_APPROVED,DATE_REPORTED,GENDER,HN,IMPRESSION,MWLWL_KEY,ORDER_DATE,ORDER_ID,ORDER_TIME,READING_TEXT,REMARK,REPORTWL_KEY,RUN_AN,RUN_HN,STATUS,STUDY_CASE_FLAG,XRAY_ORDER_CODE,YEAR_AN,YEAR_HN,DOCTOR_REPORTED,USER_APPROVED,USER_CREATED,USER_MODIFIED,PATIENT_ID})
    return res.send({error : false,message : 'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, XRAY_NAME,ACCESSION_NO,AGE,AN,CONCEAL,DATE_APPROVED,DATE_REPORTED,GENDER,HN,IMPRESSION,MWLWL_KEY,ORDER_DATE,ORDER_ID,ORDER_TIME,READING_TEXT,REMARK,REPORTWL_KEY,RUN_AN,RUN_HN,STATUS,STUDY_CASE_FLAG,XRAY_ORDER_CODE,YEAR_AN,YEAR_HN,DOCTOR_REPORTED,USER_APPROVED,USER_CREATED,USER_MODIFIED,PATIENT_ID } = req.body;
    try {
        if(!_id){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
       
        const addXray_result = await xray_result.findOne({ _id })
        addXray_result.XRAY_NAME  = XRAY_NAME ??  addXray_result.XRAY_NAME
        addXray_result.ACCESSION_NO  = ACCESSION_NO ??  addXray_result.ACCESSION_NO
        addXray_result.AGE  = AGE ??  addXray_result.AGE
        addXray_result.AN  = AN ??  addXray_result.AN
        addXray_result.CONCEAL  = CONCEAL ??  addXray_result.CONCEAL
        addXray_result.DATE_APPROVED  = DATE_APPROVED ??  addXray_result.DATE_APPROVED
        addXray_result.DATE_REPORTED  = DATE_REPORTED ??  addXray_result.DATE_REPORTED
        addXray_result.GENDER  = GENDER ??  addXray_result.GENDER
        addXray_result.HN  = HN ??  addXray_result.HN
        addXray_result.IMPRESSION  = IMPRESSION ??  addXray_result.IMPRESSION
        addXray_result.MWLWL_KEY  = MWLWL_KEY ??  addXray_result.MWLWL_KEY
        addXray_result.ORDER_DATE  = ORDER_DATE ??  addXray_result.ORDER_DATE
        addXray_result.ORDER_ID  = ORDER_ID ??  addXray_result.ORDER_ID
        addXray_result.ORDER_TIME  = ORDER_TIME ??  addXray_result.ORDER_TIME
        addXray_result.READING_TEXT  = READING_TEXT ??  addXray_result.READING_TEXT
        addXray_result.REMARK  = REMARK ??  addXray_result.REMARK
        addXray_result.REPORTWL_KEY  = REPORTWL_KEY ??  addXray_result.REPORTWL_KEY
        addXray_result.RUN_AN  = RUN_AN ??  addXray_result.RUN_AN
        addXray_result.RUN_HN  = RUN_HN ??  addXray_result.RUN_HN
        addXray_result.STATUS  = STATUS ??  addXray_result.STATUS
        addXray_result.STUDY_CASE_FLAG  = STUDY_CASE_FLAG ??  addXray_result.STUDY_CASE_FLAG
        addXray_result.XRAY_ORDER_CODE  = XRAY_ORDER_CODE ??  addXray_result.XRAY_ORDER_CODE
        addXray_result.YEAR_AN  = YEAR_AN ??  addXray_result.YEAR_AN
        addXray_result.YEAR_HN  = YEAR_HN ??  addXray_result.YEAR_HN
        addXray_result.DOCTOR_REPORTED  = DOCTOR_REPORTED ??  addXray_result.DOCTOR_REPORTED
        addXray_result.USER_APPROVED  = USER_APPROVED ??  addXray_result.USER_APPROVED
        addXray_result.USER_CREATED  = USER_CREATED ??  addXray_result.USER_CREATED
        addXray_result.USER_MODIFIED  = USER_MODIFIED ??  addXray_result.USER_MODIFIED
        addXray_result.PATIENT_ID  = PATIENT_ID ??  addXray_result.PATIENT_ID
        addXray_result.DATE_MODIFIED = Date.now()
        await addXray_result.save()
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
        const addXray_result = await xray_result.deleteOne({ _id: id })
        if (addXray_result.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };