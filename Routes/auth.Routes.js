const auth = require("../Middleware/auth");
const express = require("express")
const router  = express.Router();



router.post('/refresh/token',auth.RefreshToken);

module.exports =router;