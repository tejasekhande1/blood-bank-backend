const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    bloodRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BloodRequest",
        },
    ],
});

module.exports = mongoose.model("User", userSchema);