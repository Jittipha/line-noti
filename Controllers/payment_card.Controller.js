const payment_card = require('../models/payment_card')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const encode_service = require('../services/Encrypt_Decrypt_services')
exports.getAll = async (req, res) => {

    try {
        const data = await payment_card.find()
        return res.send(data)
    } catch (err) {
        return res.status(400)
    }
};

exports.getbyID = async (req, res) => {
    let _id = req.params.id
    try {
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let data = await payment_card.findOne({ _id })
        data.cardNumber = encode_service.decrypt(data.cardNumber)
        let split = data.cardNumber.split('');
        const cardNumber_blinded = `${split[0]}${split[1]}** **** **** ${split[12]}${split[13]}${split[14]}${split[15]}`
        data.cardNumber = cardNumber_blinded
        return res.send({ error: false, data: data })
    } catch (err) {
        return res.status(400)
    }
};







exports.adddata = async (req, res) => {

    let { cardNumber, cardHolderName, cvvNumber, expiryDate, PATIENT_ID, typeofCreditCard, bank_owner } = req.body
    try {
        if (!cardNumber || !cardHolderName || !cvvNumber || !expiryDate || !PATIENT_ID || !typeofCreditCard || !bank_owner) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        let encoded_cardNumber = encode_service.encrypt(cardNumber)
        const add_get_service = await payment_card.create({ cardNumber: encoded_cardNumber, cardHolderName, cvvNumber, expiryDate, PATIENT_ID, typeofCreditCard, bank_owner })
        let split = add_get_service.cardNumber.split('');
        const cardNumber_blinded = `${split[0]}${split[1]}** **** **** ${split[12]}${split[13]}${split[14]}${split[15]}`
        const data = { cardNumber: cardNumber_blinded, cardHolderName: add_get_service.cardHolderName, expiryDate: add_get_service.expiryDate, }
        return res.send({ error: false, message: 'Created!', _id: payment_card._id, data: data })
        return res.send(sasdas)

    } catch (err) {
        return res.status(400)
    }
};

exports.updatedata = async (req, res) => {

    let { _id, cardNumber, cardHolderName, cvvNumber, expiryDate, PATIENT_ID, typeofCreditCard, bank_owner } = req.body;
    try {
        let encoded_cardNumber
        if (!_id) {
            return res.send({ error: true, message: 'กรุณากรอกข้อมูลให้ครบ' })
        }
        if(cardNumber){
             encoded_cardNumber = encode_service.encrypt(cardNumber)
        }
        const payment_card_data = await payment_card.findOne({ _id })
        payment_card_data.bank_owner = bank_owner ?? payment_card_data.bank_owner
        payment_card_data.cardNumber = cardNumber ?? payment_card_data.cardNumber
        payment_card_data.cardHolderName = cardHolderName ?? payment_card_data.cardHolderName
        payment_card_data.cvvNumber = cvvNumber ?? payment_card_data.cvvNumber
        payment_card_data.expiryDate = expiryDate ?? payment_card_data.expiryDate
        payment_card_data.PATIENT_ID = PATIENT_ID ?? payment_card_data.PATIENT_ID
        payment_card_data.typeofCreditCard = typeofCreditCard ?? payment_card_data.typeofCreditCard
        payment_card_data.updatedAt = Date.now()
        await payment_card_data.save()
        return res.send({ error: false, message: 'Updated' })

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
        const payment_card_data = await payment_card.deleteOne({ _id: id })
        if (payment_card_data.deletedCount === 1) {
            return res.send({ error: false, message: 'Deleted' })
        } else {
            return res.send({ error: true, message: 'failed' })
        }


    } catch (err) {
        return res.status(400)
    }
};

