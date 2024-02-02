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
        const checkedUserExist = await User.findOne({ email });
        if (checkedUserExist) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }

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

        console.log("Recent OTP -> ", recentOTP[0].otp);
        console.log("OTP -> ", otp);

        if (recentOTP.length === 0 || recentOTP[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: `Error in validating otp`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profile = await Profile.create({
            contactNumber: null,
            age: null,
            bloodGroup: null,
        });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profile: profile._id,
        });

        return res.status(200).json({
            status: true,
            message: "User registered successfully",
            data: user,
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
                message: `Both feilds are required`,
            });
        }

        const user = User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User not found`,
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user._id,
                email: user.email,
                role: user.accountType,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: Date.now() + 3 * 24 * 60 * 60 * 100,
            };

            return res.cookies("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User loggied in successfully",
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
            message: `Error while loging user : ${error.message}`,
            error: error,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmedNewPassword } = req.body;

        if (newPassword !== confirmedNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirmed new password do not match.",
            });
        }

        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isOldPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect old password.",
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

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