const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    contactNumber: {
        type: String,
    },
    age: {
        type: String,
    },
    bloodGroup: {
        type: String,
    },
    availability: {
        type: String,
        enum: ["yes", "no"],
        default: "no"
    },
    location: [
        {
            type: String,
        }
    ]
})

module.exports = mongoose.model("Profile", profileSchema);