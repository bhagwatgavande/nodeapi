const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name: String,
    email: String,
    mobile: Number,
    profilepic: String,
    status: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);