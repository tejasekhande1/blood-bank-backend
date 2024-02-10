const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    neededUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    donarUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ["read", "unread"],
        default: "unread"
    }
});

module.exports = mongoose.model("Notification", notificationSchema);