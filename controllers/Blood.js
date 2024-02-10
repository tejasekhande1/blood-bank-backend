const BloodRequest = require('../models/BloodRequest')
const User = require('../models/User');

exports.addBloodRequest = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const newBloodRequest = await BloodRequest.create(req.body);
        const user = await User.findByIdAndUpdate(userId, { $push: { bloodRequest: newBloodRequest._id } }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Blood request created successfully',
            data: newBloodRequest
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create blood request',
            error: error.message
        });
    }
}


exports.getBloodRequests = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const user = await User.findById(userId).populate('bloodRequest');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blood requests retrieved successfully',
            data: user.bloodRequest
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve blood requests',
            error: error.message
        });
    }
}

exports.getAllBloodRequests = async (req, res) => {
    try {
        const bloodRequests = await BloodRequest.find().sort({ postedOn: -1 });

        return res.status(200).json({
            success: true,
            message: 'All blood requests retrieved successfully',
            data: bloodRequests
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve blood requests',
            error: error.message
        });
    }
};

exports.deleteBloodRequest = async (req, res) => {
    try {
        const { requestId } = req.params; 
        const { id: userId } = req.user;

        const user = await User.findByIdAndUpdate(userId, { $pull: { bloodRequest: requestId } }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await BloodRequest.findByIdAndDelete(requestId);

        return res.status(200).json({
            success: true,
            message: 'Blood request deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blood request',
            error: error.message
        });
    }
}
