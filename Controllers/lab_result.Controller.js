const lab_result = require('../models/lab_result')

exports.getAll = async (req, res) => {

    try {
      const data = await lab_result.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {AGE,AN,CONCEAL,DATA_TYPE,DATE_APPROVED,DATE_RECEIVED,DATE_REPORTED,DATE_TESTED,GENDER,HIGH_CRITICAL_REF,HN,LAB_ORDER_CODE,LAB_RESULT_CODE,LOW_CRITICAL_REF,MAX_NUMBER_REF,MAX_TEST_REF,MIN_NUMBER_REF,MIN_TEXT_REF,NUMBER_VALUE,ORDER_DATE,ORDER_ID,ORDER_TIME,REMARK,RESULT_VALUE,RUN_AN,RUN_HN,SAMPLE_ID,STATUS,SUGGESTION,SYMBOL,TEXT_VALUE,YEAR_AN,YEAR_HN,USER_APPROVED,USER_CREATED,USER_MODIFIED,USER_RECEIVED,USER_REPORTED,USER_TESTED,PATIENT_ID,LAB_NAME,LAB_GROUP_NAME} = req.body
   try{ 
    if(!LAB_NAME|| !LAB_GROUP_NAME||!DATE_REPORTED ||!GENDER ||!HN ||! ORDER_DATE||! ORDER_ID||!ORDER_TIME ||!YEAR_HN ||!USER_TESTED ||!USER_CREATED ||!USER_MODIFIED ||! PATIENT_ID){
        return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addLab_result = await lab_result.create({AGE,AN,CONCEAL,DATA_TYPE,DATE_APPROVED,DATE_RECEIVED,DATE_REPORTED,DATE_TESTED,GENDER,HIGH_CRITICAL_REF,HN,LAB_ORDER_CODE,LAB_RESULT_CODE,LOW_CRITICAL_REF,MAX_NUMBER_REF,MAX_TEST_REF,MIN_NUMBER_REF,MIN_TEXT_REF,NUMBER_VALUE,ORDER_DATE,ORDER_ID,ORDER_TIME,REMARK,RESULT_VALUE,RUN_AN,RUN_HN,SAMPLE_ID,STATUS,SUGGESTION,SYMBOL,TEXT_VALUE,YEAR_AN,YEAR_HN,USER_APPROVED,USER_CREATED,USER_MODIFIED,USER_RECEIVED,USER_REPORTED,USER_TESTED,PATIENT_ID,LAB_NAME,LAB_GROUP_NAME})
    return res.send({error : false,message : 'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, AGE,AN,CONCEAL,DATA_TYPE,DATE_APPROVED,DATE_RECEIVED,DATE_REPORTED,DATE_TESTED,GENDER,HIGH_CRITICAL_REF,HN,LAB_ORDER_CODE,LAB_RESULT_CODE,LOW_CRITICAL_REF,MAX_NUMBER_REF,MAX_TEST_REF,MIN_NUMBER_REF,MIN_TEXT_REF,NUMBER_VALUE,ORDER_DATE,ORDER_ID,ORDER_TIME,REMARK,RESULT_VALUE,RUN_AN,RUN_HN,SAMPLE_ID,STATUS,SUGGESTION,SYMBOL,TEXT_VALUE,YEAR_AN,YEAR_HN,USER_APPROVED,USER_CREATED,USER_MODIFIED,USER_RECEIVED,USER_REPORTED,USER_TESTED,PATIENT_ID,LAB_NAME,LAB_GROUP_NAME } = req.body;
    try {
        if(!_id){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
       
        const addLab_result = await lab_result.findOne({ _id })
        addLab_result.LAB_NAME  = LAB_NAME ??  addLab_result.LAB_NAME
        addLab_result.LAB_GROUP_NAME  = LAB_GROUP_NAME ??  addLab_result.LAB_GROUP_NAME
        addLab_result.AGE  = AGE ??  addLab_result.AGE
        addLab_result.AN  = AN ??  addLab_result.AN
        addLab_result.CONCEAL  = CONCEAL ??  addLab_result.CONCEAL
        addLab_result.DATA_TYPE  = DATA_TYPE ??  addLab_result.DATA_TYPE
        addLab_result.DATE_APPROVED  = DATE_APPROVED ??  addLab_result.DATE_APPROVED
        addLab_result.DATE_RECEIVED  = DATE_RECEIVED ??  addLab_result.DATE_RECEIVED
        addLab_result.DATE_REPORTED  = DATE_REPORTED ??  addLab_result.DATE_REPORTED
        addLab_result.DATE_TESTED  = DATE_TESTED ??  addLab_result.DATE_TESTED
        addLab_result.GENDER  = GENDER ??  addLab_result.GENDER
        addLab_result.HIGH_CRITICAL_REF  = HIGH_CRITICAL_REF ??  addLab_result.HIGH_CRITICAL_REF
        addLab_result.HN  = HN ??  addLab_result.HN
        addLab_result.LAB_ORDER_CODE  = LAB_ORDER_CODE ??  addLab_result.LAB_ORDER_CODE
        addLab_result.LAB_RESULT_CODE  = LAB_RESULT_CODE ??  addLab_result.LAB_RESULT_CODE
        addLab_result.LOW_CRITICAL_REF  = LOW_CRITICAL_REF ??  addLab_result.LOW_CRITICAL_REF
        addLab_result.MAX_NUMBER_REF  = MAX_NUMBER_REF ??  addLab_result.MAX_NUMBER_REF
        addLab_result.MAX_TEST_REF  = MAX_TEST_REF ??  addLab_result.MAX_TEST_REF
        addLab_result.MIN_NUMBER_REF  = MIN_NUMBER_REF ??  addLab_result.MIN_NUMBER_REF
        addLab_result.MIN_TEXT_REF  = MIN_TEXT_REF ??  addLab_result.MIN_TEXT_REF
        addLab_result.NUMBER_VALUE  = NUMBER_VALUE ??  addLab_result.NUMBER_VALUE
        addLab_result.ORDER_DATE  = ORDER_DATE ??  addLab_result.ORDER_DATE
        addLab_result.ORDER_ID  = ORDER_ID ??  addLab_result.ORDER_ID
        addLab_result.ORDER_TIME  = ORDER_TIME ??  addLab_result.ORDER_TIME
        addLab_result.REMARK  = REMARK ??  addLab_result.REMARK
        addLab_result.RESULT_VALUE  = RESULT_VALUE ??  addLab_result.RESULT_VALUE
        addLab_result.RUN_AN  = RUN_AN ??  addLab_result.RUN_AN
        addLab_result.RUN_HN  = RUN_HN ??  addLab_result.RUN_HN
        addLab_result.SAMPLE_ID  = SAMPLE_ID ??  addLab_result.SAMPLE_ID
        addLab_result.STATUS  = STATUS ??  addLab_result.STATUS
        addLab_result.SUGGESTION  = SUGGESTION ??  addLab_result.SUGGESTION
        addLab_result.SYMBOL  = SYMBOL ??  addLab_result.SYMBOL
        addLab_result.TEXT_VALUE  = TEXT_VALUE ??  addLab_result.TEXT_VALUE
        addLab_result.YEAR_AN  = YEAR_AN ??  addLab_result.YEAR_AN
        addLab_result.USER_APPROVED  = USER_APPROVED ??  addLab_result.USER_APPROVED
        addLab_result.USER_CREATED  = USER_CREATED ??  addLab_result.USER_CREATED
        addLab_result.USER_MODIFIED  = USER_MODIFIED ??  addLab_result.USER_MODIFIED
        addLab_result.USER_RECEIVED  = USER_RECEIVED ??  addLab_result.USER_RECEIVED
        addLab_result.USER_REPORTED  = USER_REPORTED ??  addLab_result.USER_REPORTED
        addLab_result.USER_TESTED  = USER_TESTED ??  addLab_result.USER_TESTED
        addLab_result.PATIENT_ID  = PATIENT_ID ??  addLab_result.PATIENT_ID
        addLab_result.DATE_MODIFIED = Date.now()
        await addLab_result.save()
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
        const addLab_result = await lab_result.deleteOne({ _id: id })
        if (addLab_result.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };