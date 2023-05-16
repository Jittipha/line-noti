const lineController = require("../Controllers/line_notify.Controller");
const express = require("express");
const router = express.Router();

router.get("/redirect", lineController.redirect);
router.post("/adddata", lineController.adddata);

module.exports = router;
