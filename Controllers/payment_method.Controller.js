const paymentMethod = require('../models/payment_method')

exports.getAll = async (req, res) => {

    try {
      const data = await paymentMethod.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {methodName,imagePath} = req.body
   try{ 
   
    const addPaymentMethod = await paymentMethod.create({methodName,imagePath})
    return res.send(addPaymentMethod)
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, methodName,imagePath } = req.body;
    try {
        
        const paymentMethod_data = await paymentMethod.findOne({ _id })
        paymentMethod_data.methodName = methodName
        paymentMethod_data.imagePath = imagePath
        paymentMethod_data.updatedAt = Date.now()
        await paymentMethod_data.save()
        return res.send(paymentMethod_data)
  
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
        const paymentMethod_data = await paymentMethod.deleteOne({ _id: id })
        if (paymentMethod_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };