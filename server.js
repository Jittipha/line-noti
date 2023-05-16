var express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
var app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
const port = process.env.PORT || 4000;
const db = require("./config/dbconfig");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
db();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

let allLogStream = rfs.createStream("access.log", {
  size: "100MB",
  interval: "1d",
  maxFiles: 30,
  // compress: 'gzip',
  path: path.resolve(__dirname, ".", "logs"),
});

app.use(
  morgan(
    ":remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
    {
      skip: function (req, res) {
        return res.statusCode != 200;
      },
      stream: fs.createWriteStream(
        path.join(__dirname, ".", "logs", "success.log"),
        { flags: "a" }
      ),
    }
  )
);

app.use(
  morgan(
    ":remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
    {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
      stream: fs.createWriteStream(
        path.join(__dirname, ".", "logs", "error.log"),
        { flags: "a" }
      ),
    }
  )
);

app.use(
  morgan(
    ":remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
    {
      stream: allLogStream,
    }
  )
);

app.use(cors());

app.use(bodyParser.json({ limit: "100mb" }));

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const patient_mobileController = require("./Controllers/patient_mobile.Controller");
// test socket
io.on("connection", (client) => {
  console.log(client.id);
  client.on("req", function (data) {
    //  if(!data.token){
    //   return client.emit('message','A token is required')
    //  }
    //  jwt.verify(data.token,process.env.ACCESS_TOKEN,function(err,decoded) {
    //     if(err) return client.emit('message','Invalid Token');
    //     data.decoded = decoded;
    patient_mobileController.queue_box(client, data);
    //  })
    // io.emit('data','data');
  });
});

//require Routes
const departmentRoute = require("./Routes/department.Routes");
const workPlaceRoute = require("./Routes/work_place.Routes");
const patientRoute = require("./Routes/patient");
const userRoute = require("./Routes/user.Routes");
const docScheduleRoute = require("./Routes/docSchedule.Routes");
const docExtraRoute = require("./Routes/docExtra.Routes");
const appointmentRoute = require("./Routes/appointment.Routes");
const xrayResultRoute = require("./Routes/xray_result.Routes");
const labResultRoute = require("./Routes/lab_result.Routes");
const opdClinicRoute = require("./Routes/opd_clinic.Routes");
const medicalHistoryRoute = require("./Routes/medical_history.Routes");
const financeRoute = require("./Routes/finance.Routes");
const useDrugHistoryRoute = require("./Routes/use_drug_history.Routes");
const authRoute = require("./Routes/auth.Routes");
const cancelRoute = require("./Routes/cancel_reason.Routes");
const rightRoute = require("./Routes/right.Routes");
const opd_rightRoute = require("./Routes/opd_right.Routes");
const buildingRoute = require("./Routes/building.Routes");
const healthRecordRoute = require("./Routes/health_record.Routes");
const medicalCertRoute = require("./Routes/medical_cert.Routes");
const patientDrugAllergiesRoute = require("./Routes/patient_drug_allergies.Routes");
const patientDrugAllergiesGroupRoute = require("./Routes/patient_drug_allergies_group.Routes ");
const patientFoodAllergiesRoute = require("./Routes/patient_food_allergies.Routes");
const patientHealthRoute = require("./Routes/patient_health.Routes");
const telemedRoute = require("./Routes/telemed.Routes");

const suggestionRoute = require("./Routes/suggestion.Routes");
const reportRoute = require("./Routes/report.Routes");
const reportTypeRoute = require("./Routes/report_type.Routes");
const paymentRoute = require("./Routes/payment.Routes");
const paymentMethodRoute = require("./Routes/payment_method.Routes");
const paymentCardRoute = require("./Routes/payment_card.Routes");
const statusPaymentlRoute = require("./Routes/status_payment.Routes");
const otpRoute = require("./Routes/otp.Routes");
const symptonRoute = require("./Routes/sympton.Routes");
const getServiceRoute = require("./Routes/get_service.Routes");
const patientMobile = require("./Routes/patient_mobile");
const checkInRoute = require("./Routes/check_in.Routes");

const pushNotiRoute = require("./Routes/push-notification.Routes");
const lineNotifyRoute = require("./Routes/line_notify.Routes");

server.listen(port, () => {
  console.log("Node App is running or port " + port);
});

const redis = require("redis");
const finance = require("./models/finance");
const client = redis.createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/api", async (req, res) => {
  return res.send({
    error: false,
    message: "Welcom to test api appointment",
    written_by: "Nanine",
    published_on: "",
  });
});

// data from his
app.use("/api/workplace", workPlaceRoute);
app.use("/api/symp", symptonRoute);
app.use("/api/department", departmentRoute);
app.use("/api/patient", patientRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/doc/schedule", docScheduleRoute);
app.use("/api/doc/extra", docExtraRoute);
app.use("/api/doc", userRoute);
app.use("/api/xray/result", xrayResultRoute);
app.use("/api/lab/result", labResultRoute);
app.use("/api/opd/clinic", opdClinicRoute);
app.use("/api/medical/history", medicalHistoryRoute);
app.use("/api/finance", financeRoute);
app.use("/api/use/drug/history", useDrugHistoryRoute);
app.use("/api/auth", authRoute);
app.use("/api/cancel/reason", cancelRoute);
app.use("/api/right", rightRoute);
app.use("/api/opd/right", opd_rightRoute);
app.use("/api/building", buildingRoute);
app.use("/api/health/record", healthRecordRoute);
app.use("/api/medical/cert", medicalCertRoute);
app.use("/api/patient/drug/allergies", patientDrugAllergiesRoute);
app.use("/api/patient/drug/allergies/group", patientDrugAllergiesGroupRoute);
app.use("/api/patient/food/allergies", patientFoodAllergiesRoute);
app.use("/api/patient/health", patientHealthRoute);
app.use("/api/telemed", telemedRoute);

app.use("/api/suggestion", suggestionRoute);
app.use("/api/report", reportRoute);
app.use("/api/report/type", reportTypeRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/payment/method", paymentMethodRoute);
app.use("/api/payment/card", paymentCardRoute);
app.use("/api/status/payment", statusPaymentlRoute);
app.use("/api/patient/mobile", patientMobile);
app.use("/api/image", express.static("uploads"));
app.use("/api/otp", otpRoute);
app.use("/api/get/service", getServiceRoute);
app.use("/api/check/in", checkInRoute);
app.use("/api/line/noti", lineNotifyRoute);
app.use("/api/notifi", pushNotiRoute);
