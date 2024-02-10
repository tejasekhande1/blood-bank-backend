const express = require("express");
const router = express.Router();


const { auth } = require('../middlewares/Auth');
const { updateProfileDetails } = require("../controllers/User");

router.put('/profile', auth, updateProfileDetails);

module.exports = router;