const { ObjectID } = require('bson');
const payment = require('../models/payment')
const finance = require('../models/finance')
const paymentCard = require('../models/payment_card');
const payment_card = require('../models/payment_card');
const encode_service = require('../services/Encrypt_Decrypt_services')
exports.getByPatient = async (req, res) => {
  let {PATIENT_ID,SORT} = req.body
  try {
      if(!SORT){
       SORT = -1
      }
      else{
       SORT = parseInt(SORT)
      }
      if (!PATIENT_ID) {
          return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
      }
      let data = await finance.aggregate([
          {
              $match : {PATIENT_ID : ObjectID(PATIENT_ID) }
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
              $lookup: {
                  from: 'patients',
                  localField: 'PATIENT_ID',
                  foreignField: '_id',
                  as: 'PATIENT'
              }
          },
          {
              $unwind: '$PATIENT'
          },
        //   {
        //     $lookup: {
        //         from: 'payments',
        //         localField: 'ORDER_ID',
        //         foreignField: 'ORDER_ID',
        //         as: 'PAYMENT_HISTORY'
        //     }
        // },
        // {
        //     $unwind: '$PAYMENT_HISTORY'
        // },
          {
              $group: {
                  _id: '$ORDER_ID',
                  status: {$first :'$STATUS'},
                  date: {$first : '$ORDER_DATE'},
                  time: {$first :'$ORDER_TIME'},
                  total_copay: {$sum: '$COPAY'},
                  total_discount: {$sum: '$DISCOUNT'},
                  hn : {$first : '$HN'},
                  patient :  { $first: { $concat: ["$PATIENT.PRE_NAME", " ", "$PATIENT.FIRST_NAME", " ", "$PATIENT.LAST_NAME"] } },
                  doctor: { $first: { $concat: ["$DOCTOR.PRE_NAME", " ", "$DOCTOR.FIRST_NAME", " ", "$DOCTOR.LAST_NAME"] } },
              }
          },
          {
            $project : {
              '_id' : 1,
              'status' : 1,
              'date' : 1,
              'time' : 1,
              // 'total_copay' : 1,
              'hn' : 1,
              'total' : {$subtract : ['$total_copay','$total_discount']},
              'patient' : 1,
              'doctor' : 1,
            }
          },
          {
            $sort : {
              'status' : -1,
              'date' : SORT
            }
          }
          
      ])
      for(let x = 0 ;x<data.length;x++){
        if(data[x].status == 'A'){
          let data_payment = await payment.aggregate([
            {
              $match : {ORDER_ID : data[x]._id }
            },
            
          {
            $project : {
              '_id' : 0,
              'amount' : 0,
              'ORDER_ID' : 0,
              'createdAt' : 0,
              'updatedAt' : 0,
              '__v' : 0,
           
            }
          },
          ])
          
          data[x].history = data_payment[0]
        }
      }

      
      return res.send({error : false,data : data})
  } catch (err) {
      return res.status(400)
  }
};


exports.getByOrderID = async (req, res) => {
  let ORDER_ID = req.params.id
  try {
      if (!ORDER_ID) {
          return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
      }
      const data = await finance.aggregate([
          {
              $match : {ORDER_ID : ORDER_ID }
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
              $lookup: {
                  from: 'patients',
                  localField: 'PATIENT_ID',
                  foreignField: '_id',
                  as: 'PATIENT'
              }
          },
          {
              $unwind: '$PATIENT'
          },
          {
              $group: {
                  _id: '$ORDER_ID',
                  status: {$first :'$STATUS'},
                  date: {$first : '$ORDER_DATE'},
                  time: {$first :'$ORDER_TIME'},
                  total_claim: {$sum: '$CLAIM'},
                  total_copay: {$sum: '$COPAY'},
                  total_discount: {$sum: '$DISCOUNT'},
                  patient :  { $first:{ PATIENT_ID : "$PATIENT._id", NAME :  { $concat:  ["$PATIENT.PRE_NAME", " ", "$PATIENT.FIRST_NAME", " ", "$PATIENT.LAST_NAME"] },HN : "$HN"} },
                  doctor: { $first: { $concat: ["$DOCTOR.PRE_NAME", " ", "$DOCTOR.FIRST_NAME", " ", "$DOCTOR.LAST_NAME"] } },
                  detail : {$push : {"EXPENSE_NAME" : "$EXPENSE_NAME","CLAIM" : "$CLAIM","COPAY":"$COPAY","DISCOUNT":"$DISCOUNT"}}
              }
          },
          {
            $project : {
              '_id' : 1,
              'status' : 1,
              'date' : 1,
              'time' : 1,
              'total_copay' : 1,
              'total_discount' : {$add : ['$total_claim','$total_discount']},
              'total' : {$add : ['$total_claim','$total_copay']},
              'must_pay' : {$subtract : ['$total_copay','$total_discount']},
              'patient' : 1,
              'doctor' : 1,
              'detail' : 1,
            }
          },

          
         
          
      ])

      const data_my_card = await paymentCard.aggregate([
        {
          $match : {PATIENT_ID : ObjectID(data[0].patient.PATIENT_ID) }
        },
      {
        $project : {
          '_id' : 1,
          'cardNumber' : 1,
          'typeofCreditCard' : 1,
       
        }
      },
      ])

      const data_payment = await payment.aggregate([
        {
          $match : {ORDER_ID : ORDER_ID }
        },
        {
          $lookup: {
              from: 'payment_cards',
              localField: 'PAYMENT_CARD_ID',
              foreignField: '_id',
              as: 'PAYMENT_CARD_ID'
          }
      },
      {
          $unwind: '$PAYMENT_CARD_ID'
      },
      {
        $project : {
          'createdAt' : 0,
          'updatedAt' : 0,
          '__v' : 0,
       
        }
      },
      ])
      if(data_payment.length != 0){
        let split =  data_payment[0].PAYMENT_CARD_ID.cardNumber.split('');
        const cardNumber = `${split[0]}${split[1]}** **** **** ${split[12]}${split[13]}${split[14]}${split[15]}`
          data_payment[0].PAYMENT_CARD_ID.cardNumber = cardNumber
      }
     
      let my_card = []
      for(let x =0;x<data_my_card.length;x++){
        data_my_card[x].cardNumber = encode_service.decrypt(data_my_card[x].cardNumber)
        let split = data_my_card[x].cardNumber.split('');
        const cardNumber = `${split[0]}${split[1]}** **** **** ${split[12]}${split[13]}${split[14]}${split[15]}`
        my_card.push({_id : data_my_card[x]._id,cardNumber:cardNumber,typeofCreditCard : data_my_card[x].typeofCreditCard  })
      }
      return res.send({error : false,data : data[0],my_card :my_card,payment_history : data_payment[0]})
  } catch (err) {
      return res.status(400)
  }
};


exports.update_paid = async (req, res) => {

  let {PATIENT_ID,ORDER_ID,PAYMENT_CARD_ID,visitNo,receiptNumber,refNumber,amount}= req.body;
  let dateofPaid = new Date()

  try {
    if (!PATIENT_ID ||!ORDER_ID || !PAYMENT_CARD_ID ||! amount) {
            return res.send({ error: true, massage: 'กรุณากรอกข้อมูลให้ครบ' })
          }
     const finance_data =await finance.updateMany({ORDER_ID},{$set :{STATUS: "A",DATE_STATUSED : Date.now()},},{multi : true})
     const data_mycard = await payment_card.findOne({_id : PAYMENT_CARD_ID})
      const addPayment = await payment.create({PAYMENT_TYPE_DESC : 'บัตรเดบิต/เครดิต',amount,visitNo,receiptNumber,refNumber,dateofPaid,PATIENT_ID,ORDER_ID,PAYMENT_CARD_ID})
      let split = data_mycard.cardNumber.split('');
      const cardNumber = `${split[0]}${split[1]}** **** **** ${split[12]}${split[13]}${split[14]}${split[15]}`
      const data = {cardNumber : cardNumber,cardHolderName : data_mycard.cardHolderName,receiptNumber: addPayment.receiptNumber, refNumber: addPayment.refNumber,dateofPaid : addPayment.dateofPaid,amount : addPayment.amount }
      return res.send({error : false,message:'Updated',data :data})
  } catch (err) {
      return res.status(400)
  }
};

exports.update_data = async (req, res) => {

  let {_id,PATIENT_ID,PAYMENT_TYPE_DESC,ORDER_ID,PAYMENT_CARD_ID,visitNo,receiptNumber,refNumber,dateofPaid,amount}= req.body;
  try {
    if (!_id) {
            return res.send({ error: true, massage: 'กรุณากรอกข้อมูลให้ครบ' })
          }
          const payment_data = await payment.findOne({ _id })     
          payment_data.amount  = amount  ??payment_data.amount  
          payment_data.PAYMENT_TYPE_DESC  = PAYMENT_TYPE_DESC  ??payment_data.PAYMENT_TYPE_DESC  
          payment_data.ORDER_ID  = ORDER_ID  ??payment_data.ORDER_ID  
          payment_data.PAYMENT_CARD_ID  = PAYMENT_CARD_ID  ??payment_data.PAYMENT_CARD_ID  
           payment_data.visitNo  = visitNo  ??payment_data.visitNo  
           payment_data.receiptNumber  = receiptNumber  ??payment_data.receiptNumber  
           payment_data.refNumber  = refNumber  ??payment_data.refNumber  
           payment_data.dateofPaid  = dateofPaid  ??payment_data.dateofPaid  
           payment_data.PATIENT_ID  = PATIENT_ID  ??payment_data.PATIENT_ID  
          payment_data.updatedAt = Date.now()
        await payment_data.save()
      return res.send({error : false,message:'Updated'})
  } catch (err) {
      return res.status(400)
  }
};


// exports.getdata_by_personalID = async (req, res) => {

//   let personalID = req.params.id

//   try {
//     if (!personalID) {
//       return res.send({ error: true, massage: 'กรุณากรอกข้อมูลให้ครบ' })
//     }
//     const data = await payment.aggregate([
//       {
//         $match: {
//           personalID: ObjectID(personalID)
//         }
//       },
//       {
//         $lookup: {
//           from: 'personals',
//           localField: 'personalID',
//           foreignField: '_id',
//           as: 'personal'
//         }
//       },
//       {
//         $unwind: '$personal'
//       },
//       {
//         $lookup: {
//           from: 'prefix_personals',
//           localField: 'personal.prefix',
//           foreignField: '_id',
//           as: 'personal.prefix'
//         }
//       },
//       {
//         $unwind: '$personal.prefix'
//       },
//       {
//         $lookup: {
//           from: 'status_payments',
//           localField: 'statusID',
//           foreignField: '_id',
//           as: 'status'
//         }
//       },
//       {
//         $unwind: '$status'
//       },

//       {
//         $project: {
//           'personal.prefix.createdAt': 0,
//           'personal.prefix.updatedAt': 0,
//           'personal.prefix.__v': 0,
//           'personal.createdAt': 0,
//           'personal.updatedAt': 0,
//           'personal.__v': 0,
//           'status.createdAt': 0,
//           'status.updatedAt': 0,
//           'status.__v': 0,
//           'personalID': 0,
//           'statusID': 0,
//           'createdAt': 0,
//           'updatedAt': 0,
//           '__v': 0,
//         }
//       }
//     ])
//     return res.send(data)
//   } catch (err) {
//     return res.status(400)
//   }
// };

// exports.getdata_byID = async (req, res) => {

//   let _id = req.params.id

//   try {
//     if (!_id) {
//       return res.send({ error: true, massage: 'กรุณากรอกข้อมูลให้ครบ' })
//     }
//     const payment_data = payment.aggregate([
//       {
//         $match: {
//           _id: ObjectID(_id)
//         }
//       },
//       {
//         $lookup: {
//           from: 'payment_details',
//           localField: '_id',
//           foreignField: 'paymentID',
//           as: 'paymentDetail'
//         }
//       },
//       // {
//       //   $lookup: {
//       //     from: 'payment_methods',
//       //     localField: 'paymentMethodID',
//       //     foreignField: '_id',
//       //     as: 'paymentMethod'
//       //   }
//       // },
//       // {
//       //   $unwind : "$paymentMethod"
//       // },
//       {
//         $lookup: {
//           from: 'personals',
//           localField: 'personalID',
//           foreignField: '_id',
//           as: 'personal'
//         }
//       },
//       {
//         $unwind: '$personal'
//       },
//       {
//         $lookup: {
//           from: 'prefix_personals',
//           localField: 'personal.prefix',
//           foreignField: '_id',
//           as: 'personal.prefix'
//         }
//       },
//       {
//         $unwind: '$personal.prefix'
//       },
//       {
//         $lookup: {
//           from: 'status_payments',
//           localField: 'statusID',
//           foreignField: '_id',
//           as: 'status'
//         }
//       },
//       {
//         $unwind: '$status'
//       },


//       {
//         $project: {
//           // priceTotal : {$sum : '$paymentDetail'},
//           'paymentDetail.createdAt': 0,
//           'paymentDetail.updatedAt': 0,
//           'paymentDetail.__v': 0,
//           'personal.prefix.createdAt': 0,
//           'personal.prefix.updatedAt': 0,
//           'personal.prefix.__v': 0,
//           'personal.createdAt': 0,
//           'personal.updatedAt': 0,
//           'personal.__v': 0,
//           'status.createdAt': 0,
//           'status.updatedAt': 0,
//           'status.__v': 0,
//           'personalID': 0,
//           'statusID': 0,
//           'createdAt': 0,
//           'updatedAt': 0,
//           '__v': 0,
//         }
//       },

//     ]).exec(async (err, data) => {
//       if (err) return res.status(400).send(err)
//       if (data.length != 0) {
//         const data_for_group = await payment.aggregate([
//           {
//             $match: {
//               _id: ObjectID(_id)
//             }
//           },
//           {
//             $lookup: {
//               from: 'payment_details',
//               localField: '_id',
//               foreignField: 'paymentID',
//               as: 'paymentDetail'
//             }
//           },
         
//           {
//             $group: {
//               "_id": "$_id",
//               'pricetotal': {
//                 $sum: {
//                   $add: [
//                     { '$sum': "$paymentDetail.undisbured" },
//                     { '$sum': "$paymentDetail.disbured" }
//                   ]
//                 }
//               },
//               'discountTotal': {
//                 $sum: {
//                   $add: [
//                     { '$sum': "$paymentDetail.discount" },
//                     { '$sum': "$paymentDetail.disbured" }
//                   ]
//                 }
//               },
             
//             }
//           },
//           {
//             $project : {
//               '_id': 1,
//               'pricetotal': 1,
//               'discountTotal': 1,
//               'mustpayTotal':
//               {
//                 $subtract: ["$pricetotal",
//                   "$discountTotal"]
//               },
//             }
//           }
//         ])
//         data[0].priceTotal = data_for_group[0].pricetotal
//         data[0].discountTotal = data_for_group[0].discountTotal
//         data[0].mustpayTotal = data_for_group[0].mustpayTotal
//         return res.send(data)
//       }
//       return res.send(data)
//     })
//   } catch (err) {
//     return res.status(400)
//   }
// };
