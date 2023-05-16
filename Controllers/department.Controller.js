const department = require('../models/department')
const axios = require('axios')

exports.getAll = async (req, res) => {

    try {
      const data = await department.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};


exports.getAll_dropdown = async (req, res) => {

    try {
      const data = await department.find().select('_id departmentName')
      return res.send({error : false,data : data})
    } catch (err) {
      return res.status(400)
    }
};

exports.getAll_real_data = async (req, res) => {
  try {
    const response_getdata = await axios.get(`${process.env.END_POINT_TOP_API}/AdminSystem/GetListDepartments`,{});
    return res.send({error : false,data : response_getdata.data.responseData});
  } catch (err) {
    return res.status(400)
  }
};


exports.adddata = async (req, res) => {

    let {departmentName} = req.body
   try{ 
    
    const addDepartment = await department.create({departmentName})
    return res.send({error : false,message :'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, departmentName } = req.body;
    try {
       
        const department_data = await department.findOne({ _id })
        department_data.departmentName  = departmentName
        department_data.DATE_MODIFIED = Date.now()
        await department_data.save()
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
        const department_data = await department.deleteOne({ _id: id })
        if (department_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };