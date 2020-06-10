const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    photo_string: String,
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    views: Number,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            comment: String,
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Post", PostSchema);