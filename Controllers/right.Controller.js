const right = require('../models/right')

exports.getAll = async (req, res) => {

    try {
      const data = await right.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};




exports.adddata = async (req, res) => {

    let {CASH_FLAG,NAME,E_NAME,RIGHT_DESC,USER_CREATED} = req.body
   try{ 
    
    const addRight = await right.create({CASH_FLAG,NAME,E_NAME,RIGHT_DESC,USER_CREATED})
    return res.send({error : false,message :'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, CASH_FLAG,NAME,E_NAME,RIGHT_DESC,USER_CREATED,USER_MODIFIED } = req.body;
    try {
       
        const right_data = await right.findOne({ _id })
        right_data.CASH_FLAG  = CASH_FLAG ?? right_data.CASH_FLAG
        right_data.NAME  = NAME ?? right_data.NAME
        right_data.E_NAME  = E_NAME ?? right_data.E_NAME
        right_data.RIGHT_DESC  = RIGHT_DESC ?? right_data.RIGHT_DESC
        right_data.USER_CREATED  = USER_CREATED ?? right_data.USER_CREATED
        right_data.USER_MODIFIED  = USER_MODIFIED ?? right_data.USER_MODIFIED
        right_data.DATE_MODIFIED = Date.now()
        await right_data.save()
        return res.send({error : false ,message : 'Updated'})
  
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
        const right_data = await right.deleteOne({ _id: id })
        if (right_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };