const mongoose = require('mongoose');

const MessSchema = new mongoose.Schema({
    photo_string: String,
    author: {
        username: String,
        id: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'User'
        }
    },
    created_at: { type: Date, default: Date.now}
});

module.exports = mongoose.model('MessMenu', MessSchema);