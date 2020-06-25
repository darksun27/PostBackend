const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    enrollment_number: { 
        type: Number,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    user_type: {
        type: String,
        enum: ['MOD', 'USER'],
        default: 'USER'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", UserSchema);