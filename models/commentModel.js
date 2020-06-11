const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    body: String,
    author: {
        id: Number,
        username: String
    },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);