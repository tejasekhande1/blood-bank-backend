const BloodRequest = require('../models/BloodRequest')
const User = require('../models/User');

exports.addBloodRequest = async (req, res) => {
    try {
        const newBloodRequest = await BloodRequest.create(req.body);
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.bloodRequest.push(newBloodRequest._id);
        await user.save();

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

exports.getBloodRequestsForUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.bloodRequest = user.bloodRequest.sort((a, b) => b.postedOn - a.postedOn);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.populate('bloodRequest');

        return res.status(200).json({
            success: true,
            message: 'Blood requests retrieved successfully',
            data: user.bloodRequest
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve blood requests for user',
            error: error.message
        });
    }
};

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