const express = require("express");
const router = express.Router();


const { auth } = require('../middlewares/Auth');
const { updateProfileDetails, addNotification, getNotifications, updateNotification } = require("../controllers/User");

router.put('/profile', auth, updateProfileDetails);
router.post('/notification', auth, addNotification);
router.get('/notification', auth, getNotifications);
router.patch('/notification/:notificationId', auth, updateNotification);

module.exports = router;