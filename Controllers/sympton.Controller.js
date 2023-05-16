const sympton = require('../models/sympton')

exports.getAll = async (req, res) => {

    try {
      const data = await sympton.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.getAll_dropdown = async (req, res) => {

    try {
      const data = await sympton.find().select('_id SYMPTON')
      return res.send({error : false,data : data})
    } catch (err) {
      return res.status(400)
    }
};


exports.adddata = async (req, res) => {

    let {SYMPTON} = req.body
   try{ 
    
    const addSympton = await sympton.create({SYMPTON})
    return res.send(addSympton)
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, SYMPTON } = req.body;
    try {
       
        const sympton_data = await sympton.findOne({ _id })
        sympton_data.SYMPTON  = SYMPTON
        sympton_data.DATE_MODIFIED = Date.now()
        await sympton_data.save()
        return res.send(sympton_data)
  
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
        const sympton_data = await sympton.deleteOne({ _id: id })
        if (sympton_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };