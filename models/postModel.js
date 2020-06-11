const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    image_string: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: { type: Number, default: 0 },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Post", PostSchema);
