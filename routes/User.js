const express = require("express");
const router = express.Router();


const { auth } = require('../middlewares/Auth');
const { updateProfileDetails, addNotification, getNotifications, updateNotification, updateUserAvailability, getUserProfile } = require("../controllers/User");

router.put('/profile', auth, updateProfileDetails);
router.get('/profile', auth, getUserProfile)
router.post('/notification', auth, addNotification);
router.get('/notification', auth, getNotifications);
router.patch('/notification/:notificationId', auth, updateNotification);
router.patch('/profile/active', auth, updateUserAvailability);

module.exports = router;