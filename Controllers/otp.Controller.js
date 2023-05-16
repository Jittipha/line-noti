const service = require('../services/General_services')

exports.CreateOTP = (req, res, next) => {
  
  services.createNewOTP(req.params, (error, results) => {
    if (error) {
      return res.status(400)
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.verifyOTP = (req, res, next) => {
  services.verifyOTP(req.body, (error, results) => {
    if (error) {
      return res.status(400)
    }
    return res.status(200).send({

      data: results,
    });
  });
};