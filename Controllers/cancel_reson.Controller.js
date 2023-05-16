const cancelReason = require('../models/cancel_reason')

exports.getAll = async (req, res) => {

    try {
      const data = await cancelReason.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};


exports.getAll_dropdown = async (req, res) => {

    try {
      const data = await cancelReason.find().select('_id REASON')
      return res.send({error : false,data : data})
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {REASON} = req.body
   try{ 
    
    const addcancelReason = await cancelReason.create({REASON})
    return res.send({error : false,message :'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, REASON } = req.body;
    try {
       
        const cancelReason_data = await cancelReason.findOne({ _id })
        cancelReason_data.REASON  = REASON ??   cancelReason_data.REASON
        cancelReason_data.DATE_MODIFIED = Date.now()
        await cancelReason_data.save()
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
        const cancelReason_data = await cancelReason.deleteOne({ _id: id })
        if (cancelReason_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };