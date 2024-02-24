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

        newBloodRequest.user = user._id;
        await newBloodRequest.save();

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
        const bloodRequests = await BloodRequest.find({ user: { $ne: req.user.id } })
            .sort({ postedOn: -1 })
            .populate({
                path: 'user',
                select: 'name email profile',
                populate: {
                    path: 'profile',
                    select: 'contactNumber age bloodGroup'
                }
            })
            .lean();

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
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blood request',
            error: error.message
        });
    }
}

exports.getBloodRequestsByFilter = async (req, res) => {
    try {

        const { search, bloodGroup, state, city } = req.query;

        const query = {
            name: { $regex: new RegExp(search, 'i') }
        };

        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        if (state) {
            query.state = state;
        }

        if (city) {
            query.city = city;
        }

        const bloodRequests = await BloodRequest.find(query).populate({
            path: 'user',
            select: 'name email profile',
            populate: {
                path: 'profile',
                select: 'contactNumber age bloodGroup'
            }
        }).lean();


        return res.status(200).json({
            success: true,
            message: 'Blood requests retrieved successfully',
            data: bloodRequests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get blood requests',
            error: error.message
        });
    }
}

exports.searchDonar = async (req, res) => {
    try {
        const { search, bloodGroup, state, city } = req.query;

        const query = {
            name: { $regex: new RegExp(search, 'i') }
        };

        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (state) query.state = state;
        if (city) query.city = city;

        const donors = await User.find(query)
            .populate({
                path: 'profile',
                select: 'availability',
                match: { availability: 'yes' }
            });

        return res.status(200).json({
            success: true,
            message: 'Donors retrieved successfully',
            data: donors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to search for donors',
            error: error.message
        });
    }
};
