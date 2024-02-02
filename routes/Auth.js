const express = require("express");
const router = express.Router();

const { sendOTP, signUp, getAllUsers, login, changePassword } = require('../controllers/Auth')
const { auth } = require('../middlewares/Auth')

router.post("/signup", signUp)
router.post("/sendOTP", sendOTP)
router.get("/user", getAllUsers)
router.post("/login", login)
router.post("/changePassword", changePassword)

module.exports = router;