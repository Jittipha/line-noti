const statusPayment = require('../models/status_payment')

exports.getAll = async (req, res) => {

    try {
      const data = await statusPayment.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {statusName} = req.body
   try{ 
   
    const status = await statusPayment.create({statusName})
    return res.send(status)
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, statusName } = req.body;
    try {
       
        const statusdata = await statusPayment.findOne({ _id })
        statusdata.statusName = statusName
        statusdata.updatedAt = Date.now()
        await statusdata.save()
        return res.send(statusdata)
  
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
        const status_data = await statusPayment.deleteOne({ _id: id })
        if (status_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };