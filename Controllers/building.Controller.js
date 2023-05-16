const building = require('../models/building')

exports.getAll = async (req, res) => {

    try {
      const data = await building.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};




exports.adddata = async (req, res) => {

    let {NAME,E_NAME} = req.body
   try{ 
    
    const addBuilding = await building.create({NAME,E_NAME})
    return res.send({error : false,message :'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, NAME,E_NAME } = req.body;
    try {
       
        const building_data = await building.findOne({ _id })
        building_data.NAME  = NAME ??  department_data.NAME 
        building_data.E_NAME  = E_NAME ??  department_data.E_NAME 
        building_data.DATE_MODIFIED = Date.now()
        await building_data.save()
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
        const building_data = await building.deleteOne({ _id: id })
        if (building_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };