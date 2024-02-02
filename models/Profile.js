const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    contactNumber: {
        type: String,
    },
    age: {
        type: String,
    },
    bloodGroup: {
        type: String,
    }
})

module.exports = mongoose.model("Profile", profileSchema);