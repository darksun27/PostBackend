const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);