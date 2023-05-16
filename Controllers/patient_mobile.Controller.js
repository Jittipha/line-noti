const personal = require('../models/patient_mobile')
const appointment = require('../models/appoint')
const main_personal = require('../models/patient')
const service = require('../services/General_services')
const bcrypt = require('bcrypt')
const moment = require('moment');
const { ObjectID } = require('bson');
const today = moment().startOf('day')
const redis = require('redis');
const { check } = require('express-validator');
const client = redis.createClient()
const crypto = require("crypto");
const auth = require('../Middleware/auth')
const { aggregate } = require('../models/appoint')
const { ReturnDocument } = require('mongodb')
const queue = require('../models/queue')

exports.getAll = async (req, res) => {

  try {
    const data = await personal.find()
    return res.send(data)
  } catch (err) {
    return res.status(400)
  }
};

exports.Get_Profile = async (req, res) => {
  let PATIENT_ID = req.params.id
  try {
    if (!PATIENT_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const data = await main_personal.findOne({ _id: PATIENT_ID })
    const data_mobile = await personal.findOne({ PATIENT_ID: PATIENT_ID })

    data.imageProfile = data_mobile.imageProfile
    return res.send({ error: false, data: data })
  } catch (err) {
    return res.status(400)
  }
};

exports.getByID = async (req, res) => {
  let _id = req.params.id
  try {
    if (!_id) {
      return res.status(400).
        send({ error: true, message: "Please กรอกข้อมูลให้ครบ" });
    }
    let data = await personal.aggregate([
      {
        $match: { _id: ObjectID(_id) }
      },
      {
        $lookup: {
          from: 'patients',
          localField: 'PATIENT_ID',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $unwind: "$patient"
      },
      {
        $project: {
          'patient.DATE_CREATED': 0,
          'patient.DATE_MODIFIED': 0,
          'patient.__v': 0,
          'pdpaFlag': 0,
          'password': 0,
          'identificationNumber': 0,
          'imageIDcard': 0,
          'passwordUpdated': 0,
          'ipAddress': 0,
          'createdAt': 0,
          'updatedAt': 0,
          '__v': 0,

        }
      }
    ])
    const now_date = new Date()
    const startOfday_now = moment(now_date).startOf('day').toDate()
    const endOfday_now = moment(now_date).endOf('day').toDate()
    const queue_data = await queue.aggregate([
      {
        $match: {
          $and: [
            { PATIENT_ID: ObjectID(data[0].PATIENT_ID) },
            {
              'createdAt': { $gte: startOfday_now }
            },
            {
              'createdAt': { $lte: endOfday_now }
            },
            {
              'status': { $eq: 'W' }
            },

          ]
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'DEPART_ID',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: '$department'
      },
      {
        $lookup: {
          from: 'appoints',
          localField: 'APPOINT_ID',
          foreignField: '_id',
          as: 'appoint'
        }
      },
      {
        $unwind: '$appoint'
      },
    ])
    if (queue_data.length != 0) {
      const create_date = new Date(queue_data[0].createdAt)
      const startOfday = moment(create_date).startOf('day').toDate()
      const endOfday = moment(create_date).endOf('day').toDate()
      const get_count_queue_in_date = await queue.aggregate([
        {
          $match: {
            $and: [
              {
                DEPART_ID: ObjectID(queue_data[0].department._id)
              },
              {
                'createdAt': { $gte: startOfday }
              },
              {
                'createdAt': { $lte: endOfday }
              },
              {
                'statutsUpdatedAt': { $lt: create_date }
              },
              {
                'status': { $eq: 'W' }
              },

            ]
          }
        }
      ])
      queue_data[0].COUNT_QUEUE = get_count_queue_in_date.length
      queue_data[0].AVG_WAITING_TIME = get_count_queue_in_date.length * queue_data[0].appoint.DURATION
    }


    data[0].queue_data = queue_data[0]

    let split = data[0].patient.ID_CARD.split('');
    data[0].patient.ID_CARD = `${split[0]}-****-*****-${split[10]}${split[11]}-${split[12]}`
    let split_MOBILE = data[0].patient.MOBILE.split('');
    data[0].patient.MOBILE = `${split_MOBILE[0]}${split_MOBILE[1]}${split_MOBILE[2]}-${split[3]}${split[4]}${split[5]}-${split_MOBILE[6]}${split_MOBILE[7]}${split_MOBILE[8]}${split_MOBILE[9]}`
    data[0].patient.MOBILE_BLIND = `${split_MOBILE[0]}${split_MOBILE[1]}x-xxx-${split_MOBILE[6]}${split_MOBILE[7]}${split_MOBILE[8]}${split_MOBILE[9]}`
    return res.send({ error: false, data: data[0] })
  } catch (err) {
    return res.status(400)
  }
};


exports.GetUpcoming_Booking = async (req, res) => {
  let PATIENT_ID = req.params.id
  try {
    if (!PATIENT_ID) {
      return res.status(400).
        send({ error: true, message: "Please กรอกข้อมูลให้ครบ" });
    }
    DATE_NOW = new Date()
    const startOfday = moment(DATE_NOW).startOf('day').toDate()
    const HOUR = DATE_NOW.getHours()
    const MINUTE = DATE_NOW.getMinutes()
    appointment.aggregate([
      {
        $match: {
          $and: [
            {
              PATIENT_ID: ObjectID(PATIENT_ID)
            },
            {
              'APPOINT_DATE': { $gte: startOfday }
            },
            {
              'START_TIME': { $ne: null }
            },
            {
              'CONFIRM_STATUS': { $eq: "" }
            },
          ]
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'DEPART_ID',
          foreignField: '_id',
          as: 'DEPART'
        }
      },
      {
        $unwind: '$DEPART'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'DOCTOR',
          foreignField: '_id',
          as: 'DOCTOR'
        }
      },
      {
        $unwind: '$DOCTOR'
      },
      {
        $project: {
          'HN': 0,
          'DURATION': 0,
          'IMAGE': 0,
          'DEPART_ID': 0,
          'URGRNCY': 0,
          'SYMPTON': 0,
          'SYMPTON_REMARK': 0,
          'WORK_ID': 0,
          'DATE_CREATED': 0,
          'DATE_MODIFIED': 0,
          '__v': 0,
        }
      }

    ]).exec(async (err, data) => {
      if (err) throw err
      if (data.length == 0) {
        return res.send({ error: true, message: 'empty' })
      }
      for (let x = 0; x < data.length; x++) {
        let starttime = parseInt(data[x].START_TIME.split('.')[0])
        let starttime_min = parseInt(data[x].START_TIME.split('.')[1])
        // console.log(starttime + ' ' + HOUR + '-' + starttime_min + ' ' + MINUTE)
        // console.log(data[x].APPOINT_DATE)
        const real_date = service.addHours(DATE_NOW, 7)
        // console.log(real_date)
        if (Math.sign(service.cal_diff_date(real_date, data[x].APPOINT_DATE)) === 0) {
          if (starttime > HOUR) {
            return res.send({ error: false, data: data[x] })
          }
          else if (starttime == HOUR && starttime_min > MINUTE) {
            return res.send({ error: false, data: data[x] })
          }
        }
        else {
          return res.send({ error: false, data: data[x] })
        }
      }
      return res.send({ error: true, message: 'empty' })
    })


  } catch (err) {
    return res.status(400)
  }
};



exports.Checkalready = async (req, res) => {
  let identificationNumber = req.params.identificationNumber
  try {
    console.log(identificationNumber)
    if (!identificationNumber) {
      return res.status(400).
        send({ error: true, message: "Please กรอกข้อมูลให้ครบ" });
    }
    const data = await personal.find({ identificationNumber })
    if (data.length == 0) {
      console.log('working')
      const check_main_personal = await main_personal.findOne({ ID_CARD: identificationNumber })
      if (check_main_personal === null) {
        return res.send({ error: false, message: 'ไม่มีผู้ใช้งานนี้ (HIS)' })

      }
      else {
        let split = check_main_personal.MOBILE.split('');
        const phone = `${split[0]}${split[1]}x-xxx-${split[6]}${split[7]}${split[8]}${split[9]}`
        return res.send({ error: false, message: 'ผู้ใช้งานนี้มีบัญชีแล้ว (HIS)', data: { PATIENT_ID: check_main_personal._id, identificationNumber: check_main_personal.ID_CARD, hn: check_main_personal.HN, prefix: check_main_personal.PRE_NAME, firstName: check_main_personal.FIRST_NAME, lastName: check_main_personal.LAST_NAME, gender: check_main_personal.GENDER, dateofBirth: check_main_personal.BIRTHDATE, phone: phone } })
      }
    }
    else {
      const data_patient = await main_personal.findOne({ _id: data[0].PATIENT_ID })
      let split = data_patient.MOBILE.split('');
      const phone = `${split[0]}${split[1]}x-xxx-${split[6]}${split[7]}${split[8]}${split[9]}`
      return res.send({ error: true, message: 'มีผู้ใช้งานนี้อยู่ในระบบ', data: { _id: data[0]._id, PATIENT_ID: data_patient._id, phone: phone } })
    }
  } catch (err) {
    return res.status(400)
  }
};



exports.CheckEmailAndBloodtype = async (req, res) => {
  let { PATIENT_ID, email, bloodType } = req.body
  console.log(PATIENT_ID)
  let emailFlag, bloodTypeFlag;
  try {
    if (!PATIENT_ID || !bloodType) {
      return res.status(400).
        send({ error: true, message: "Please กรอกข้อมูลให้ครบ" });
    }
    const data_blood = await main_personal.findOne({ _id: PATIENT_ID })
    console.log(data_blood)
    if (data_blood.BLOODGROUP == bloodType) {
      bloodTypeFlag = true;
    } else {
      bloodTypeFlag = false;
    }
    if (!email) {
      emailFlag = false;
    } else {
      const check_email = await main_personal.findOne({ _id: PATIENT_ID })
      if (check_email.EMAIL == email) {
        emailFlag = true;
      } else {
        emailFlag = false;
      }
    }
    return res.send({ error: false, data: { email: emailFlag, bloodType: bloodTypeFlag } })


  } catch (err) {
    return res.status(400)
  }
};





exports.CheckPhoneNumber = async (req, res) => {
  let { PATIENT_ID, phone } = req.body
  try {
    console.log(PATIENT_ID + phone)
    const data = await main_personal.find({ _id: PATIENT_ID, MOBILE: phone })
    if (data.length == 0) {
      return res.send({ found: false, message: 'เบอร์โทรศัพท์ไม่ตรง' })
    }
    return res.send({ found: true, message: 'เบอร์โทรศัพท์ถูกต้อง' })

  } catch (err) {
    return res.status(400)
  }
};




let refreshTokens = []
exports.Checklogin = async (req, res) => {
  let { identificationNumber, password, token_device } = req.body
  try {
    const Personal = await personal.findOne({ identificationNumber })
    if (Personal == null) {
      return res.send({ error: true, message: 'No user' })
    }
    if (await bcrypt.compare(password, Personal.password)) {
      const token = auth.generateAccessToken(Personal._id)
      const refreshtoken = auth.generateRefreshToken(Personal._id)
      refreshTokens.push(refreshtoken)
      message = "Login Success";
      console.log('token_device' + token_device)
      if (token_device && Personal.logoutFlag == 'Y') {
        Personal.logoutFlag = '';
        Personal.token_device = token_device
        await Personal.save()
      }
      return res.send({ error: false, message: message, data: { PATIENT_MOBILE_ID: Personal._id, PATIENT_ID: Personal.PATIENT_ID, token: token, refreshtoken: refreshtoken } });
    }
    else {
      return res.send({ error: true, message: 'Invalid Password' });
    }

  }
  catch (err) {
    console.log("error : " + err)
    return res.sendStatus(400)
  }
};




exports.logout = async (req, res) => {
  try {
    let {PATIENT_ID,TOKEN} = req.body
    if (!PATIENT_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const data_patient = await personal.updateOne({ PATIENT_ID }, { logoutFlag: 'Y' });
    refreshTokens = refreshTokens.filter(token => token !== TOKEN)
    return res.sendStatus(204)
  }
  catch (err) {
    return res.sendStatus(400).send(err)
  }
}


exports.adddata = async (req, res) => {

  let { PATIENT_ID, identificationNumber, imageIDcard, connectLine, accessTokenLine, password, ipAddress } = req.body
  let pdpaFlag = 'Y'

  try {

    if (!PATIENT_ID || !identificationNumber || !password || !ipAddress || !pdpaFlag) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const hashedimageIDcard = await bcrypt.hash(imageIDcard, salt)
    const personal_data = await personal.create({ PATIENT_ID, imageIDcard: hashedimageIDcard, identificationNumber, connectLine, accessTokenLine, imageIDcard, password: hashedPassword, ipAddress, pdpaFlag, status: 'N' })
    return res.send({ error: false, message: 'Created' })
  } catch (err) {
    return res.status(400)
  }
};





exports.cancelLine = async (req, res) => {
  let _id = req.params.id;
  try {
    if (!_id) {
      return res.
        send({ error: true, message: "Please กรอกข้อมูลให้ครบ" });
    }
    const personal_data = personal.findOne({ _id })
      .exec(async (err, data) => {
        if (err) return res.send({ error: true, data: err })
        data.connectLine = "N"
        data.accessTokenLine = ""
        data.updatedAt = Date.now()
        await data.save()
        return res.send({ error: false, message: "Line canceled!" })
      })

  } catch (err) {
    return res.status(400)
  }
};

exports.resetPassword = async (req, res) => {
  let { _id, password } = req.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    personal.findOne({ _id }).exec(async (err, data) => {
      if (err) return res.send({ error: true, data: err })
      data.password = hashedPassword
      data.updatedAt = Date.now()
      await data.save()
      const data_main = await main_personal.findOne({ _id: data.PATIENT_ID })

      return res.send({ error: false, message: "reset success!", data: `${data_main.PRE_NAME} ${data_main.FIRST_NAME} ${data_main.LAST_NAME}` })
    })


  } catch (err) {
    return res.status(400)
  }
};

exports.change_password = async (req, res) => {
  let { _id, old_password, new_password } = req.body
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedNewPassword = await bcrypt.hash(new_password, salt)
    const Patient = await personal.findOne({ _id })
    if (await bcrypt.compare(old_password, Patient.password)) {
      Patient.password = hashedNewPassword
      Patient.passwordUpdated = new Date()
      Patient.save()
      return res.send({ error: false, message: 'Updated' })
    }
    else {
      return res.send({ error: true, message: 'Invalid Password' })
    }
  } catch (err) {
    return res.status(400)
  }
};




exports.updatedata = async (req, res) => {

  let { _id, PATIENT_ID, identificationNumber, imageIDcard, connectLine, accessTokenLine, password, ipAddress, pdpaFlag, status } = req.body;
  try {
    if (!_id) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    let hash_image
    let decode
    // crypto module
    // const crypto = require("crypto");
    // const algorithm = "aes-256-cbc"; 

    // // generate 16 bytes of random data
    // const initVector = crypto.randomBytes(16);

    // // protected data
    // const message = "This is a secret message";

    // // secret key generate 32 bytes of random data
    // const Securitykey = crypto.randomBytes(32);

    // // the cipher function
    // const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    // // encrypt the message
    // // input encoding
    // // output encoding
    // let encryptedData = cipher.update(imageIDcard, "utf-8", "hex");
    // let split = imageIDcard.split('')


    // console.log("Encrypted message: " + encryptedData);

    // console.log("length: " + split.length);    
    // if (imageIDcard) {
    //   console.log(process.env.SECURITY_KEY)
    //   const cipher = crypto.createCipheriv(process.env.KEY_IMAGE, process.env.SECURITY_KEY, process.env.INITVECTOR);
    //   hash_image = cipher.update(imageIDcard, "utf-8", "hex");
    //   hash_image += cipher.final("hex");
    //   const decipher = crypto.createDecipheriv(process.env.KEY_IMAGE, process.env.SECURITY_KEY, process.env.INITVECTOR);
    //   decode = decipher.update(hash_image, "hex", "utf-8");
    //   decode += decipher.final("utf8");
    //   console.log(hash_image)
    //   console.log(decode)
    // }
    const personal_data = await personal.findOne({ _id })
    personal_data.PATIENT_ID = PATIENT_ID ?? personal_data.PATIENT_ID
    personal_data.identificationNumber = identificationNumber ?? personal_data.identificationNumber
    personal_data.imageIDcard = imageIDcard ?? personal_data.imageIDcard
    personal_data.connectLine = connectLine ?? personal_data.connectLine
    personal_data.accessTokenLine = accessTokenLine ?? personal_data.accessTokenLine
    personal_data.password = password ?? personal_data.password
    personal_data.ipAddress = ipAddress ?? personal_data.ipAddress
    personal_data.pdpaFlag = pdpaFlag ?? personal_data.pdpaFlag
    personal_data.status = status ?? personal_data.status
    personal_data.updatedAt = Date.now()
    await personal_data.save()
    return res.send({ error: false, message: "update data success!" })



  } catch (err) {
    return res.status(400)
  }
};

exports.update_main_data = async (req, res) => {

  let { PATIENT_ID, PRE_NAME, FIRST_NAME, LAST_NAME, GENDER, BIRTHDATE, MOBILE } = req.body;
  try {
    let BIRTHDATE_CONVERTED
    if (!PATIENT_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    if (BIRTHDATE) {
      BIRTHDATE_CONVERTED = new Date(BIRTHDATE)
    }
    const data_main_patient = await main_personal.findOne({ _id: PATIENT_ID })
    data_main_patient.PRE_NAME = PRE_NAME ?? data_main_patient.PRE_NAME
    data_main_patient.FIRST_NAME = FIRST_NAME ?? data_main_patient.FIRST_NAME
    data_main_patient.LAST_NAME = LAST_NAME ?? data_main_patient.LAST_NAME
    data_main_patient.GENDER = GENDER ?? data_main_patient.GENDER
    data_main_patient.BIRTHDATE = BIRTHDATE_CONVERTED ?? data_main_patient.BIRTHDATE
    data_main_patient.MOBILE = MOBILE ?? data_main_patient.MOBILE
    data_main_patient.DATE_MODIFIED = Date.now()
    data_main_patient.save()
    return res.send({ error: false, message: 'Updated' })
  } catch (err) {
    return res.status(400)
  }
};


exports.Upload_Image = async (req, res) => {
  let _id = req.body._id
  try {
    if (!_id || !req.file) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    console.log(_id)
    let filename = req.file.filename
    let data = await personal.findOne({ _id })
    if (data.imageProfile != undefined) {
      const path = './uploads/' + data.imageProfile
      service.delete_file(path, (error, result) => {
        if (error) {
          return res.send({ error: true, message: result })
        }
      })
    }

    data.imageProfile = filename
    await data.save()
    return res.send({ error: false, message: 'upload image success!' })


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
    const personal_data = await personal.deleteOne({ _id: id }).exec(async (err, data) => {
      if (err) return res.send({ error: true, data: err })
      if (data.deletedCount === 1) {
        return res.send({ error: false, message: 'Deleted' })
      } else {
        return res.send({ error: true, message: 'Delete failed' })
      }
    })


  } catch (err) {
    return res.status(400)
  }
};



exports.getAllMyappoint_inMonth = async (req, res) => {
  let { PATIENT_ID, date } = req.body
  let date_input
  try {
    if (!PATIENT_ID) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    if (!date) {
      date_input = new Date()
    } else {
      date_input = new Date(date)
    }
    let Alldata = []
    const month_input = date_input.getMonth()
    const month_now = new Date().getMonth()
    const startOfMonth = moment(date_input).startOf('month')
    const endOfMonth = moment(date_input).endOf('month')
    let query_start_date
    if (month_input == month_now) {
      query_start_date = {
        'APPOINT_DATE': { $gte: today.toDate() }
      }
    } else {
      query_start_date = {
        'APPOINT_DATE': { $gte: startOfMonth.toDate() }
      }
    }

    let data_Upcoming = await appointment.aggregate([
      {
        $match: {
          $and: [
            {
              PATIENT_ID: ObjectID(PATIENT_ID)
            },
            {
              'APPOINT_DATE': { $gte: startOfMonth.toDate() }
            },
            {
              'APPOINT_DATE': { $lte: endOfMonth.toDate() }
            },

          ]
        }
      },

      {
        $group: {
          _id: '$APPOINT_DATE',
          CONFIRM_STATUS: { $first: '$CONFIRM_STATUS' },
          data: { $push: { '_id': '$_id', 'APPOINT_TYPE': '$APPOINT_TYPE', 'CONFIRM_STATUS': '$CONFIRM_STATUS', 'APPOINT_STATUS': '$APPOINT_STATUS' } },
          count: { $sum: 1 }

        }
      },
      {
        $sort: {
          '_id': 1
        }
      },
      // {
      //   $project: {
      //     'START_TIME': 0,
      //     'END_TIME': 0,
      //     'HN': 0,
      //     'PATIENT_ID': 0,
      //     'DOCTOR': 0,
      //     'DEPART_ID': 0,
      //     'DATE_CREATED': 0,
      //     'DATE_MODIFIED': 0,
      //     '__v': 0,
      //     "URGRNCY": 0,
      //     "SYMPTON": 0,
      //     "SYMPTON_REMARK": 0
      //   }
      // },

    ])
    // let data_notcome = await appointment.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         {
    //           PATIENT_ID: ObjectID(PATIENT_ID)
    //         },
    //         {
    //           'APPOINT_DATE': { $gte: startOfMonth.toDate() }
    //         },
    //         {
    //           'APPOINT_DATE': { $lte: endOfMonth.toDate() }
    //         },
    //         {
    //           'CONFIRM_STATUS': { $eq: 'N' }
    //         },

    //       ]
    //     }
    //   },
    //   {
    //     $project: {
    //       'START_TIME': 0,
    //       'END_TIME': 0,
    //       'HN': 0,
    //       'PATIENT_ID': 0,
    //       'DOCTOR': 0,
    //       'DEPART_ID': 0,
    //       'DATE_CREATED': 0,
    //       'DATE_MODIFIED': 0,
    //       '__v': 0,
    //     }
    //   },

    // ])

    // let data_success = await appointment.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         {
    //           PATIENT_ID: ObjectID(PATIENT_ID)
    //         },
    //         {
    //           'APPOINT_DATE': { $gte: startOfMonth.toDate() }
    //         },
    //         {
    //           'APPOINT_DATE': { $lte: endOfMonth.toDate() }
    //         },
    //         {
    //           'CONFIRM_STATUS': { $eq: 'F' }
    //         },

    //       ]
    //     }
    //   },
    //   {
    //     $project: {
    //       'START_TIME': 0,
    //       'END_TIME': 0,
    //       'HN': 0,
    //       'PATIENT_ID': 0,
    //       'DOCTOR': 0,
    //       'DEPART_ID': 0,
    //       'DATE_CREATED': 0,
    //       'DATE_MODIFIED': 0,
    //       '__v': 0,
    //     }
    //   },

    // ])
    // let max_value = Math.max(data_Upcoming.length, data_notcome.length, data_success.length)
    // if (max_value != 0) {
    //   for (let x = 0; x < max_value; x++) {
    //     if (x < data_Upcoming.length) {
    //       Alldata.push({ _id: data_Upcoming[x]._id, APPOINT_DATE: data_Upcoming[x].APPOINT_DATE, APPOINT_TYPE: data_Upcoming[x].APPOINT_TYPE, CONFIRM_STATUS: data_Upcoming[x].CONFIRM_STATUS, COUNT: 1,TYPE : 'UP' })
    //     }
    //     if (x < data_notcome.length) {
    //       Alldata.push({ _id: data_notcome[x]._id, APPOINT_DATE: data_notcome[x].APPOINT_DATE, APPOINT_TYPE: data_notcome[x].APPOINT_TYPE, CONFIRM_STATUS: data_notcome[x].CONFIRM_STATUS, COUNT: 1,TYPE : 'NO' })
    //     }
    //     if (x < data_success.length) {
    //       Alldata.push({ _id: data_success[x]._id, APPOINT_DATE: data_success[x].APPOINT_DATE, APPOINT_TYPE: data_success[x].APPOINT_TYPE, CONFIRM_STATUS: data_success[x].CONFIRM_STATUS, COUNT: 1,TYPE : 'SU' })
    //     }
    //   }
    // }

    // const dates = [
    //   new Date("2022-01-01"),
    //   new Date("2022-01-01"),
    //   new Date("2021-11-30"),
    //   new Date("2022-08-15"),
    // ];
    // const uniqueDates = [...new Set(Alldata.map(date => date.APPOINT_DATE.getTime()))]
    //   .map(time => new Date(time));

    // console.log(uniqueDates);






    return res.send({ error: false, data: data_Upcoming })
  } catch (err) {
    throw err
  }


}




exports.getMyappoint_Upcoming = async (PATIENT_ID, startOfMonth, endOfMonth) => {
  try {
    const data = await appointment.aggregate([
      {
        $match: {
          $and: [

            {
              PATIENT_ID: ObjectID(PATIENT_ID)
            },
            {
              'APPOINT_DATE': { $gte: today.toDate() }
            },
            {
              'APPOINT_DATE': { $lte: endOfMonth.toDate() }
            },
          ]
        }
      },
      {
        $project: {
          'START_TIME': 0,
          'END_TIME': 0,
          'HN': 0,
          'PATIENT_ID': 0,
          'DOCTOR': 0,
          'DEPART_ID': 0,
          'DATE_CREATED': 0,
          'DATE_MODIFIED': 0,
          '__v': 0,
        }
      }
    ])
    return data
  } catch (err) {
    throw err
  }
}

exports.getAllMyappoint_inDate = async (req, res) => {
  let { date, PATIENT_ID } = req.body

  try {
    if (!date) {
      return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
    }
    const date_start = moment(date).startOf('day').toDate()
    const date_end = moment(date).endOf('day').toDate()
    let data_doctor = await appointment.aggregate([
      {
        $match: {
          $and: [
            {
              PATIENT_ID: ObjectID(PATIENT_ID)
            },
            {
              'APPOINT_DATE': { $gte: date_start }
            },
            {
              'APPOINT_DATE': { $lte: date_end }
            },

          ]
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'DEPART_ID',
          foreignField: '_id',
          as: 'depart'
        }
      },
      {
        $unwind: "$depart"
      },
      {
        $lookup: {
          from: 'users',
          localField: 'DOCTOR',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $unwind: "$doctor"
      },
      {
        $project: {
          'doctor.DATE_CREATED': 0,
          'doctor.DATE_MODIFIED': 0,
          'doctor.__v': 0,
          'depart.createdAt': 0,
          'depart.updatedAt': 0,
          'depart.__v': 0,
          'DATE_CREATED': 0,
          'DATE_MODIFIED': 0,
          '__v': 0
        }
      }
      // {
      //   $sort :{
      //     '$seq' : 1
      //   }
      // }
    ])
    let data_no_doctor = await appointment.aggregate([
      {
        $match: {
          $and: [
            {
              PATIENT_ID: ObjectID(PATIENT_ID)
            },
            {
              'APPOINT_DATE': { $gte: date_start }
            },
            {
              'APPOINT_DATE': { $lte: date_end }
            },
            {
              'DOCTOR': { $eq: null }
            },

          ]
        }
      },
      {
        $lookup: {
          from: 'symptons',
          localField: 'SYMPTON',
          foreignField: '_id',
          as: 'sympton'
        }
      },
      {
        $unwind: "$sympton"
      },

      {
        $project: {
          'sympton.DATE_CREATED': 0,
          'sympton.DATE_MODIFIED': 0,
          'sympton.__v': 0,
          'DATE_CREATED': 0,
          'DATE_MODIFIED': 0,
          '__v': 0
        }
      }

    ])
    for (let x = 0; x < data_no_doctor.length; x++) {
      data_doctor.push(data_no_doctor[x])
    }
    return res.send({ error: false, data: data_doctor })


  } catch (err) {
    throw err
  }
}

exports.updatedata = async (req, res) => {

  let { _id, ID_CARD, HN, GENDER, E_FIRST_NAME, E_LAST_NAME, FIRST_NAME, LAST_NAME, NICK_NAME, BIRTHDATE, LINEID, MOBILE, EMAIL, BLOODGROUP, YEAR_HN, PRE_NAME, E_PRE_NAME } = req.body;
  try {

    const mainpersonal_data = await patient.findOne({ _id })
    mainpersonal_data.ID_CARD = ID_CARD ?? mainpersonal_data.ID_CARD
    mainpersonal_data.HN = HN ?? mainpersonal_data.HN
    mainpersonal_data.GENDER = GENDER ?? mainpersonal_data.GENDER
    mainpersonal_data.E_FIRST_NAME = E_FIRST_NAME ?? mainpersonal_data.E_FIRST_NAME
    mainpersonal_data.E_LAST_NAME = E_LAST_NAME ?? mainpersonal_data.E_LAST_NAME
    mainpersonal_data.FIRST_NAME = FIRST_NAME ?? mainpersonal_data.FIRST_NAME
    mainpersonal_data.LAST_NAME = LAST_NAME ?? mainpersonal_data.LAST_NAME
    mainpersonal_data.NICK_NAME = NICK_NAME ?? mainpersonal_data.NICK_NAME
    mainpersonal_data.BIRTHDATE = BIRTHDATE ?? mainpersonal_data.BIRTHDATE
    mainpersonal_data.LINEID = LINEID ?? mainpersonal_data.LINEID
    mainpersonal_data.MOBILE = MOBILE ?? mainpersonal_data.MOBILE
    mainpersonal_data.EMAIL = EMAIL ?? mainpersonal_data.EMAIL
    mainpersonal_data.BLOODGROUP = BLOODGROUP ?? mainpersonal_data.BLOODGROUP
    mainpersonal_data.YEAR_HN = YEAR_HN ?? mainpersonal_data.YEAR_HN
    mainpersonal_data.PRE_NAME = PRE_NAME ?? mainpersonal_data.PRE_NAME
    mainpersonal_data.E_PRE_NAME = E_PRE_NAME ?? mainpersonal_data.E_PRE_NAME
    mainpersonal_data.DATE_MODIFIED = Date.now()
    await mainpersonal_data.save()
    return res.send({ error: false, message: 'Updated' })

  } catch (err) {
    return res.status(400)
  }
};

exports.queue_box = async function (client, datas) {
  console.log(datas)
  let main_data_send = {};
  setInterval(async function () {
    try {
      let data = await personal.aggregate([
        {
          $match: { _id: ObjectID(datas.PATIENT_ID) }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'PATIENT_ID',
            foreignField: '_id',
            as: 'patient'
          }
        },
        {
          $unwind: "$patient"
        },
        {
          $project: {
            'patient.DATE_CREATED': 0,
            'patient.DATE_MODIFIED': 0,
            'patient.__v': 0,
            'pdpaFlag': 0,
            'password': 0,
            'identificationNumber': 0,
            'imageIDcard': 0,
            'passwordUpdated': 0,
            'ipAddress': 0,
            'createdAt': 0,
            'updatedAt': 0,
            '__v': 0,

          }
        }
      ])
      const now_date = new Date()
      const startOfday_now = moment(now_date).startOf('day').toDate()
      const endOfday_now = moment(now_date).endOf('day').toDate()
      const queue_data = await queue.aggregate([
        {
          $match: {
            $and: [
              { PATIENT_ID: ObjectID(data[0].PATIENT_ID) },
              {
                'createdAt': { $gte: startOfday_now }
              },
              {
                'createdAt': { $lte: endOfday_now }
              },
              {
                'status': { $eq: 'W' }
              },

            ]
          }
        },
        {
          $lookup: {
            from: 'departments',
            localField: 'DEPART_ID',
            foreignField: '_id',
            as: 'department'
          }
        },
        {
          $unwind: '$department'
        },
        {
          $lookup: {
            from: 'appoints',
            localField: 'APPOINT_ID',
            foreignField: '_id',
            as: 'appoint'
          }
        },
        {
          $unwind: '$appoint'
        },
      ])
      if (queue_data.length != 0) {
        const create_date = new Date(queue_data[0].createdAt)
        const startOfday = moment(create_date).startOf('day').toDate()
        const endOfday = moment(create_date).endOf('day').toDate()
        const get_count_queue_in_date = await queue.aggregate([
          {
            $match: {
              $and: [
                {
                  DEPART_ID: ObjectID(queue_data[0].department._id)
                },
                {
                  'createdAt': { $gte: startOfday }
                },
                {
                  'createdAt': { $lte: endOfday }
                },
                {
                  'statutsUpdatedAt': { $lt: create_date }
                },
                {
                  'status': { $eq: 'W' }
                },

              ]
            }
          }
        ])
        main_data_send.COUNT_QUEUE = get_count_queue_in_date.length
        main_data_send.AVG_WAITING_TIME = get_count_queue_in_date.length * queue_data[0].appoint.DURATION
        main_data_send.QUEUE_ID = queue_data[0]._id
        main_data_send.QUEUE_NUMBER = queue_data[0].queueNumber
        var data_list = [main_data_send]
        // data[0].queue_data = queue_data[0]
        client.emit('data', data_list)
      }
      else {
        client.emit('data', [])
      }

    }
    catch (err) {
      console.log('Error :' + err)
    }

  }, 3000)
}
