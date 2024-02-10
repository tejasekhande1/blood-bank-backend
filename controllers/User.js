const User = require('../models/User');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');

exports.updateProfileDetails = async (req, res) => {
    try {
        const { contactNumber, age, bloodGroup } = req.body;
        if (!contactNumber || !age || !bloodGroup) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`,
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User Not Found`,
            });
        }

        const updatedProfile = await Profile.create(req.body)
        user.profile = updatedProfile._id
        updatedProfile.user = user._id;
        await updatedProfile.save();
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User Profile Updated Successfully`,
            data: updatedProfile
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update user profile',
            error: error.message
        });
    }
}

exports.addNotification = async (req, res) => {
    try {

        const { bloodRequestedUserId } = req.body;
        const userId = req.user.id

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User Not Found`,
            });
        }

        const createdNotification = await Notification.create({
            neededUserId: bloodRequestedUserId,
            donarUserId: userId
        });

        const neededUser = await User.findByIdAndUpdate(bloodRequestedUserId, { $push: { notifications: createdNotification._id } }, { new: true })
        if (!neededUser) {
            return res.status(404).json({
                success: false,
                message: `Needed User Not Found`,
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Notification send successfully',
            data: createdNotification
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message
        });
    }
}

exports.getNotifications = async (req, res) => {
    try {

        const userId = req.user.id
        const notifications = await Notification.find({ neededUserId: userId }).populate(
            {
                path: "donarUserId",
                select: "name email profile",
                populate: {
                    path: 'profile',
                    select: 'contactNumber bloodGroup'
                }
            }
        )
        return res.status(200).json({
            success: true,
            message: 'Notification fetched successfully',
            data: notifications
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get notifications',
            error: error.message
        });
    }
}

exports.updateNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findById(notificationId)
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: `Notification Not Found`,
            });
        }

        notification.status = "read";
        await notification.save();

        return res.status(200).json({
            success: true,
            message: `Notification updated successfully`,
            data: notification
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update notifications',
            error: error.message
        });
    }
}

exports.updateUserAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        console.log("User Id -> ", req.user.id);
        let userProfile = await Profile.findOneAndUpdate({ user: req.user.id }, { availability }, { new: true });

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        console.log("Profile -> ", userProfile);
        console.log("User Availability -> ", userProfile.availability);
        return res.status(200).json({
            success: true,
            message: `Availability updated successfully`,
            data: userProfile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update user availability',
            error: error.message
        });
    }
}
