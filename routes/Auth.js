const express = require("express");
const router = express.Router();

const { sendOTP, signUp } = require('../controllers/Auth')

router.post("/signup", signUp)
router.post("/sendOTP", sendOTP)

module.exports = router;