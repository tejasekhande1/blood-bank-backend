const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
    try {

        const token =
            req.cookies || req.header("Authorization").replace("Bearer ", "");


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decode;
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "Error in token",
            });
        }

        next();
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Error in token verification",
        });
    }
};