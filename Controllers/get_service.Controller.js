const get_service = require('../models/get_service')

exports.getAll = async (req, res) => {

    try {
        const data = await get_service.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};

exports.get_by_type = async (req, res) => {
    let { servicetype } = req.params
    try {
        if(!servicetype){
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' }) 
        }
        const data = await get_service.find({serviceType : servicetype})
        return res.send({error : false,data : data[0].serviceList})
    } catch (err) {
        return res.status(400)
    }
};

exports.adddata = async (req, res) => {

    let { serviceType, data } = req.body
    try {
        if (!serviceType || !data) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let serviceList = JSON.parse(data)
        let data_service = await get_service.findOne({serviceType})
        if(data_service === null){
            const add_get_service = await get_service.create({ serviceType, serviceList })
            
        }
        else{
            console.log(data_service)
            for(let x = 0 ;x < serviceList.length;x++){
                data_service.serviceList.push(serviceList[x]);
            }
            await data_service.save()
        }
        return res.send({ error: false, message: 'Created!' })

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, serviceType, data } = req.body;
    try {
        if (!id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        const get_service_data = await get_service.findOne({ _id })
        get_service_data.serviceType = serviceType ?? get_service_data.serviceType
        get_service_data.data = data ??get_service_data.data
        get_service_data.DATE_MODIFIED = Date.now()
        await get_service_data.save()
        return res.send(get_service_data)

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
        const get_service_data = await get_service.deleteOne({ _id: id })
        if (get_service_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};