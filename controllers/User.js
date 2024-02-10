const User = require('../models/User');
const Profile = require('../models/Profile')

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