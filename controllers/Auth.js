const User = require("../models/User");
const Profile = require("../models/Profile")
const OTP = require('../models/OTP');
const OTPGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        var otp = OTPGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        var result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = OTPGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const OTPPayload = { email, otp };
        await OTP.create(OTPPayload);

        return res.status(200).json({
            status: true,
            message: "OTP Send Successfully",
            data: otp,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while sending OTP : ${error.message}`,
            error: error,
        });
    }
};

exports.signUp = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            otp,
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !otp
        ) {
            return res.status(400).json({
                success: false,
                message: `All fields are required`,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: `User already exists`,
            });
        }

        const recentOTP = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);

        if (recentOTP.length === 0 || recentOTP[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: `Error in validating otp`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const profile = await Profile.create({
            user:user,
            contactNumber: null,
            age: null,
            bloodGroup: null,
        });

        user.profile = profile._id;
        
        user.save() 
            .then(savedUser => {
                return User.populate(savedUser, { path: 'profile' });
            })
            .then(populatedUser => {
                console.log(populatedUser);
            })
            .catch(error => {
                console.error("Error while registering user:", error);
            });
        

        return res.status(200).json({
            status: true,
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while registering user : ${error.message}`,
            error: error,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: `Both fields are required`,
            });
        }

        const user = await User.findOne({ email })
            .select('name email profile password')
            .populate('profile');


        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User not found`,
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const payload = {
                id: user._id,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options);
            return res.status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Please enter correct password",
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Error while logging in user: ${error.message}`,
            error: error,
        });
    }
};


exports.changePassword = async (req, res) => {
    try {

        const { email, otp, password } = req.body;

        const recentOTP = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);

        if (recentOTP.length === 0 || recentOTP[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: `Error in validating otp`,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }



        const hashedNewPassword = await bcrypt.hash(password, 10);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while changing password: ${error.message}`,
            error: error,
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().maxTimeMS(30000);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        console.error("Error occurred while fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching users",
            error: error.message
        });
    }
}