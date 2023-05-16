const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";
const fs = require("fs");
const moment = require("moment");
const thaibulksmsApi = require("thaibulksms-api");
async function createNewOTP(params, callback) {
  try {
    const otp = otpGenerator.generate(6, {
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });
    const ttl = 1 * 60 * 1000;
    const expires = Date.now() + ttl;
    const ref = makeref(5);
    const data = `${params.phone}.${otp}.${expires}.${ref}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}.${ref}`;
    var otpMessage = `Your ${params.phone} OTP is ${otp}.ref = ${ref}. it will expire in 3 minutes.`;
    console.log(otpMessage);
    const options = {
      apiKey: "k19_1WukCB0-2L7pouRvHNYKW3zNYn",
      apiSecret: "notqi3wWUerIpxO7pp04qt1PFyVhKV",
    };

    // const sms = thaibulksmsApi.sms(options)
    // let body = {
    //     msisdn: params.phone,
    //     message: otpMessage,
    //     // sender: '',
    //     // scheduled_delivery: '',
    //     // force: ''
    // }
    // const response = await sms.sendSMS(body);
    // console.log(response.data)
    return callback(false, fullHash);
  } catch (err) {
    return callback(true, "error");
  }
}

function addHours(date, hours) {
  // 👇 Make copy with "Date" constructor.
  const dateCopy = new Date(date);

  dateCopy.setHours(dateCopy.getHours() + hours);

  return dateCopy;
}

async function verifyOTP(params, callback) {
  try {
    let [hashValue, expires, ref] = params.hash.split(".");
    let now = Date.now();
    if (now > parseInt(expires)) return callback(false, "OTP Expired");
    let data = `${params.phone}.${params.otp}.${expires}.${params.ref}`;
    let newCalculatedHash = crypto
      .createHmac("sha256", key)
      .update(data)
      .digest("hex");
    if (newCalculatedHash === hashValue) {
      return callback(false, "Success");
    }
    return callback(false, "Invalid OTP");
  } catch (err) {
    return callback(true, "error");
  }
}

function makeref(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function delete_file(path, callback) {
  fs.unlink(path, (err) => {
    if (err) {
      return callback(true, err);
    } else {
      return callback(false, path + " was deleted");
    }
  });
}

function cal_age(birthday, callback) {
  const startDate = new Date();
  const endDate = new Date(birthday);
  const years = Math.abs(moment.duration(endDate - startDate).years());
  const months = Math.abs(moment.duration(endDate - startDate).months());
  const days = Math.abs(moment.duration(endDate - startDate).days());
  const age = { years, months, days };
  return callback(age);
}

function numOccurrencesInMonth(year, month, dayOfWeek) {
  let count = 0;
  for (let day = 1; day <= numDaysInMonth(year, month - 1); day++) {
    const date = new Date(year, month - 1, day);

    if (date.getDay() == dayOfWeek) {
      count++;
    }
  }
  return count;
}

function numDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function cal_diff_date(date2, date1) {
  let cal_diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  return cal_diff;
}

function add_time_in_date(date, time) {
  date = new Date(date);
  const splitTime = time.split(".");
  const MinutesInMillis = parseInt(splitTime[1]) * 60 * 1000;
  const HoursInMillis = parseInt(splitTime[0]) * 60 * 60 * 1000;
  date.setTime(date.getTime() + HoursInMillis + MinutesInMillis);
  return date;
}

function add_date(date, count_date) {
  date = new Date(date);
  console.log(date);
  console.log(count_date);
  date.setDate(date.getDate() - parseInt(count_date));
  return date;
}

function getMonthWeek(year, month, week) {
  // console.log(week)
  let d = new Date(year, month - 1, 4);
  let day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setDate(d.getDate() + 7 * week);
  // console.log(d)
  return d;
}

function getWeekDates(year, month, week, dayofweek) {
  let d = getMonthWeek(year, month, week);
  for (var i = 0, arr = []; i < 7; i++) {
    arr.push(d.toDateString());
    d.setDate(d.getDate() + 1);
  }
  if (dayofweek == 1) {
    return arr[6];
  }
  return arr[dayofweek - 1];
}

function getDateofMonth(
  year_input,
  month_input,
  week,
  dayOfWeek,
  startDateofMonth_converted,
  endDate0fMonth_converted
) {
  let numOfloop = 0;
  let DateofSchedule = getWeekDates(
    year_input,
    month_input + 1,
    week,
    dayOfWeek
  );
  let date = new Date(DateofSchedule + "z");
  let cal_diff_start = cal_diff_date(date, startDateofMonth_converted);
  let cal_diff_end = cal_diff_date(endDate0fMonth_converted, date);
  // console.log(cal_diff_start)
  if (Math.sign(cal_diff_start) === -1) {
    // console.log('working -1')
    numOfloop = 1;
  } else if (
    (Math.sign(cal_diff_start) === 1 && Math.sign(cal_diff_end) === 1) ||
    cal_diff_start == 0
  ) {
    return { numOfloop, date };
  }
  return { numOfloop, date };
}

function addHours(date, hours) {
  // 👇 Make copy with "Date" constructor.
  const dateCopy = new Date(date);

  dateCopy.setHours(dateCopy.getHours() + hours);

  return dateCopy;
}



module.exports = {
  createNewOTP,
  verifyOTP,
  delete_file,
  cal_age,
  numOccurrencesInMonth,
  getWeekDates,
  cal_diff_date,
  add_time_in_date,
  add_date,
  getDateofMonth,
  addHours,
};
