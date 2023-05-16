const personal = require("../models/patient_mobile");
//const axios = require("axios");
const qs = require("qs");

exports.redirect = async (req, res) => {
  try {
    let token;
    let id;
    const { state, code } = req.query;
    const { error_description } = req.query;
    if (error_description) {
      return res.status(400).send({ message: error_description });
    }
    if (!state || !code) {
      return res.status(400).send({ message: "ข้อมุลไม่ครบ" });
    }
    console.log("State :" + state + "  Code :" + code);

    const url = "https://notify-bot.line.me/oauth/token";
    const jsonData = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri:
        "https://testnotify-production.up.railway.app/api/line/noti/redirect",
      client_id: 'ECqn7tb6U3tR68F6dSCfeE',
      client_secret: 'QYYcWgG60MwsnlBtOVUrcf2hsXDScQsFMpuUzsJEtu1',
    };

    const requestOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(jsonData),
      url,
    };
    axios(requestOption).then(async (lineRes) => {
      console.log("working");
      if (lineRes.status === 200) {
        console.log("Auth Success");
        token = lineRes.data.access_token;
        id = state;
        const data_personal = await personal.findOne({ id });
        data_personal.connectLine = "Y";
        data_personal.accessTokenLine = token;
        await data_personal.save();
        return res.send({ error: false, message: "line connected!" });
      } else {
        console.log("failed");
        return res.status(400);
      }
    });
  } catch (err) {
    return res.status(404);
  }
};

exports.adddata = async (req, res) => {
  let { TEXT } = req.body;
  console.log("Token :" + token + "  Message : " + TEXT);
  try {
    if (!TEXT) {
      console.log("empty");
      return res.status(400).send({ message: "ข้อมุลไม่ครบ" });
    }
    const url = "https://notify-api.line.me/api/notify";
    const jsonData = {
      message: TEXT,
    };
    const requestOption = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ` + token,
      },
      data: qs.stringify(jsonData),
      url,
    };
    axios(requestOption)
      .then((axiosRes) => {
        if (axiosRes.status === 200) {
          console.log("Notification Success");
          res.status(201).end();
        }
      })
      .catch((error) => {
        res.status(201).end();
        console.log(error.response.data);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
};
