const express = require("express");
const router = express.Router();


const { auth } = require('../middlewares/Auth');
const { updateProfileDetails, addNotification, getNotifications, updateNotification, updateUserAvailability, getUserProfile, updateUserProfile } = require("../controllers/User");

// router.put('/profile', auth, updateProfileDetails);
router.get('/profile', auth, getUserProfile)
router.post('/notification', auth, addNotification);
router.get('/notification', auth, getNotifications);
router.patch('/notification/:notificationId', auth, updateNotification);
router.put('/profile', auth, updateUserProfile);

module.exports = router;