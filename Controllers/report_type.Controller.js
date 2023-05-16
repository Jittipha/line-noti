const report_type = require('../models/report_type')

exports.getAll = async (req, res) => {

    try {
      const data = await report_type.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};


exports.getAll_dropdown = async (req, res) => {

    try {
      const data = await report_type.find().select('_id reportTypeName')
      return res.send({error : false,data : data})
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {reportTypeName} = req.body
   try{ 
    if(!reportTypeName){
        return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addreport_type = await report_type.create({reportTypeName})
    return res.send({error : false,message :'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, reportTypeName } = req.body;
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const report_type_data = await report_type.findOne({ _id })
        report_type_data.reportTypeName  = reportTypeName ??  report_type_data.reportTypeName
        report_type_data.DATE_MODIFIED = Date.now()
        await report_type_data.save()
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
        const report_type_data = await report_type.deleteOne({ _id: id })
        if (report_type_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };