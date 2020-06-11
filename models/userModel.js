const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    enrollment_number: Number,
    user_type: {
        type: String,
        enum: ['MOD', 'USER'],
        default: 'USER'
    }
});

module.exports = mongoose.model("User", UserSchema);