const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    contactNumber: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Profile", profileSchema);