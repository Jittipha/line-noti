const {  validationResult } = require("express-validator");


async function validator(req, res, next) {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).send({ error: error.array() })
    }
    next()
}

module.exports = validator