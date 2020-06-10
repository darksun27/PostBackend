const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    enrollment_Number: Number
});

module.exports = mongoose.model("User", UserSchema);