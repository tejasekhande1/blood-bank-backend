const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
        name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    noOfUnits: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    hospitalAddress: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    postedOn:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);