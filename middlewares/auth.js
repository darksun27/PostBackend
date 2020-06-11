const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = {
    isAuthorized: async function(req, res, next) {
        req.locals = {};
        req.locals.authorized = false;
        await User.findOne({ enrollment_number: req.body.enrollment_number }, (err, user)=> {
            if(user.user_type == 'MOD') {
                req.locals.authorized = true;
                return next();
            }
        });
        await Post.findById(req.params.id).populate("author").exec((err, post)=> {
            if(post.author.enrollment_number == req.body.enrollment_number) {
                req.locals.authorized = true;
                return next();
            }else {
                req.locals.authorized = false;
            }
        });
    }
};