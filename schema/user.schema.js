const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: false
    },
    verificationCode: {
        type: String,
        required: false
    },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;