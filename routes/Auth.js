const express = require("express");
const router = express.Router();

const { sendOTP, signUp, getAllUsers } = require('../controllers/Auth')

router.post("/signup", signUp)
router.post("/sendOTP", sendOTP)
router.get("/user", getAllUsers)

module.exports = router;