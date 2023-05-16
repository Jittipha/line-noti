const work_place = require('../models/work_place')

exports.getAll = async (req, res) => {

    try {
      const data = await work_place.find()
      return res.send(data)
    } catch (err) {
      return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let {DEPART_ID,CANCEL_FLAG,E_NAME,NAME,NAME2,NAME3,PLACE_TYPE,NOT_MEET_DR_FLAG,NEED_DR_APPOINT_FLAG,SPECIAL_APPOINT_FLAG,BUILDING_ID} = req.body
   try{ 
    if(!DEPART_ID ||!E_NAME||!NAME||!PLACE_TYPE){
        return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const addwork_place = await work_place.create({DEPART_ID,CANCEL_FLAG,E_NAME,NAME,NAME2,NAME3,PLACE_TYPE,NOT_MEET_DR_FLAG,NEED_DR_APPOINT_FLAG,SPECIAL_APPOINT_FLAG,BUILDING_ID})
    return res.send({error : false,message : 'Created'})
  
   }catch(err){
    return res.status(400)
   }
  };
  
  exports.updatedata = async (req, res) => {
  
    let { _id, DEPART_ID,CANCEL_FLAG,E_NAME,NAME,NAME2,NAME3,PLACE_TYPE,NOT_MEET_DR_FLAG,NEED_DR_APPOINT_FLAG,SPECIAL_APPOINT_FLAG,BUILDING_ID } = req.body;
    try {
        const work_place_data = await work_place.findOne({ _id })
        work_place_data.DEPART_ID  = DEPART_ID ??    work_place_data.DEPART_ID
        work_place_data.CANCEL_FLAG  = CANCEL_FLAG ??    work_place_data.CANCEL_FLAG
        work_place_data.E_NAME  = E_NAME ??    work_place_data.E_NAME
        work_place_data.NAME  = NAME ??    work_place_data.NAME
        work_place_data.NAME2  = NAME2 ??    work_place_data.NAME2
        work_place_data.NAME3  = NAME3 ??    work_place_data.NAME3
        work_place_data.PLACE_TYPE  = PLACE_TYPE ??    work_place_data.PLACE_TYPE
        work_place_data.NOT_MEET_DR_FLAG  = NOT_MEET_DR_FLAG ??    work_place_data.NOT_MEET_DR_FLAG
        work_place_data.NEED_DR_APPOINT_FLAG  = NEED_DR_APPOINT_FLAG ??    work_place_data.NEED_DR_APPOINT_FLAG
        work_place_data.SPECIAL_APPOINT_FLAG  = SPECIAL_APPOINT_FLAG ??    work_place_data.SPECIAL_APPOINT_FLAG
        work_place_data.BUILDING_ID  = BUILDING_ID ??    work_place_data.BUILDING_ID
        work_place_data.DATE_MODIFIED = Date.now()
        await work_place_data.save()
        return res.send({error :  false ,message : 'Edited'})
  
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
        const work_place_data = await department.deleteOne({ _id: id })
        if (work_place_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }
  
  
    } catch (err) {
        return res.status(400)
    }
  };