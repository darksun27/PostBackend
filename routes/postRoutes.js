const mongoose = require('mongoose');
const chalk = require('chalk');

const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports = (app)=> {

    app.get('/posts', async (req, res)=> {
        await Post.find({}).populate("author").populate("likes").populate("comments").exec((err, posts)=> {
            if(err) {
                console.log("No Posts Found");
                res.status(500);
                res.send(JSON.stringify({ message: "No Posts Found" }));
            }else {
                res.status(200);
                res.send(JSON.stringify({ posts: posts }));
            }
        })
    })

    app.get('/post/:id/view', async (req, res)=> {
        await Post.findById(req.params.id, (err, post)=> {
            if(err) {
                console.log(chalk.red("Post not found"));
                res.status(500);
                res.send(JSON.stringify({ message: "Post not found" }));
            }else {
                post.views += 1;
                post.save();
                res.status(200);
                res.send(JSON.stringify({ message: "View Registered" }));
            }
        })
    })

    app.get('/post/:id/like', async (req, res)=> {
        var data = {
            enrollment_number: req.query.enrollment_number,
        }
        await Post.findById(req.params.id, (err, post)=> {
            if(err) {
                console.log(chalk.red("Post not found"));
                res.status(500);
                res.send(JSON.stringify({ message: "Post not found" }));
            }else {
                User.findOne(data, (err, user)=> {
                    if(err || !user) {
                        res.status(500);
                        res.send(JSON.stringify({ message: "User not found" }));
                    }else {
                        post.likes.push(user);
                        post.save()
                        res.status(200);
                        res.send(JSON.stringify({ message: "Like Registered" }));
                    }
                })
            }
        })
    })

    app.post('/post/new', async (req, res)=> {
        await User.findOne({ enrollment_number: req.body.enrollment_number}, async (err, user)=> {
            if(err || !user) {
                console.log(chalk.red("User Not Found"));
                res.status(500);
                res.send(JSON.stringify({ message: "User Not Found" }));
            }else {
                var data = {
                    image_string: req.body.image_string,
                    author: user
                }
                await Post.create(data, (err, post)=> {
                    if(err) {
                        console.log(chalk.red("Error Uploading Post"));
                        res.send(JSON.stringify({ message: "Error Uploading Post" }));
                    }else {
                        console.log(chalk.green("Post Uplaoded Successfully!"));
                        res.status(200);
                        res.send(JSON.stringify({ message: "Post Uploaded Successfully" }));
                    }
                });
            }
        });
    });
};