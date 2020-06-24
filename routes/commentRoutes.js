const mongoose = require("mongoose");
const chalk = require("chalk");

const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

module.exports = (app) => {
  app.post("/post/:id/comment/new", async (req, res) => {
    await Post.findById(req.params.id, async (err, post) => {
      if (err) {
        console.log(chalk.red("Post not found"));
        res.status(500);
        res.send(JSON.stringify({ message: "Post not found" }));
      } else {
        var data = {
          body: req.body.comment_body,
          author: null,
        };
        await User.findOne(
          { enrollment_number: req.body.enrollment_number },
          async (err, user) => {
            if (err || !user) {
              console.log(chalk.red("User Not Found"));
              res.status(500);
              res.send(JSON.stringify({ message: "User Not Found" }));
            } else {
              data["author"] = user;
              await Comment.create(data, async (err, comment) => {
                if (err) {
                  console.log(chalk.red("Comment not registered"));
                  res.status(500);
                  res.send(
                    JSON.stringify({ message: "Comment not registered" })
                  );
                }
                post.comments.push(comment);
                await post.save();
                await Post.findById(req.params.id).populate({ path: "comments", populate: { path: "author", model: "User" }}).exec((err, post)=> {
                  res.status(200);
                  res.send(JSON.stringify({ comments: post.comments, message: "Comment Registered" }));
                })
              });
            }
          }
        );
      }
    });
  });

  app.post("/post/:id/comment/:commentID/delete", async (req, res) => {
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: req.params.commentID,
        },
      },
      async (err) => {
        await Comment.findByIdAndRemove(req.params.commentID, (err) => {
          if (err) {
            res.status(500);
            res.send(JSON.stringify({ message: "Comment Not Deleted" }));
          } else {
            res.status(200);
            res.send(JSON.stringify({ message: "Comment Deleted" }));
          }
        });
      }
    );
  });
};
