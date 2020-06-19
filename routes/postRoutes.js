const mongoose = require("mongoose");
const chalk = require("chalk");
const fs = require("fs");
const crypto = require("crypto");
const isAuthorized = require("../middlewares/auth");
const notifications = require("../middlewares/notification");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

module.exports = (app) => {
  app.get("/posts", async (req, res) => {
    await Post.find({})
      .populate("author")
      .populate("likes")
      .populate({ path: "comments", populate: { path: "comments.author" }})
      .exec((err, posts) => {
        if (err) {
          console.log("No Posts Found");
          res.status(500);
          res.send(JSON.stringify({ message: "No Posts Found" }));
        } else {
          res.status(200);
          res.send(JSON.stringify({ posts: posts }));
        }
      });
  });

  app.get("/post/:id/view", async (req, res) => {
    await Post.findById(req.params.id, (err, post) => {
      if (err) {
        console.log(chalk.red("Post not found"));
        res.status(500);
        res.send(JSON.stringify({ message: "Post not found" }));
      } else {
        post.views += 1;
        post.save();
        res.status(200);
        res.send(JSON.stringify({ message: "View Registered" }));
      }
    });
  });

  app.get(
    "/post/:id/like",
    notifications.postLikedNotifications,
    async (req, res) => {
      var data = {
        enrollment_number: req.query.enrollment_number,
      };
      await Post.findById(req.params.id, (err, post) => {
        if (err) {
          console.log(chalk.red("Post not found"));
          res.status(500);
          res.send(JSON.stringify({ message: "Post not found" }));
        } else {
          User.findOne(data, (err, user) => {
            if (err || !user) {
              res.status(500);
              res.send(JSON.stringify({ message: "User not found" }));
            } else {
              post.likes.push(user);
              post.save();
              res.status(200);
              res.send(JSON.stringify({ message: "Like Registered" }));
            }
          });
        }
      });
    }
  );

  app.get("/post/:id/unlike", async (req, res) => {
    var data = "";
    await User.findOne(
      { enrollment_number: req.query.enrollment_number },
      (err, user) => {
        if (err) {
          res.status(500);
          res.send(JSON.stringify({ message: "User Not Found" }));
        } else {
          data = user._id;
        }
      }
    );
    await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likes: data,
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          res.status(500);
          res.send(JSON.stringify({ message: "Could not delete like" }));
        } else {
          res.status(200);
          res.send(JSON.stringify({ message: "Like Deleted" }));
        }
      }
    );
  });

  app.post("/post/:id/delete", isAuthorized.isAuthorized, async (req, res) => {
    if (req.locals.authorized) {
      await Post.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
          res.status(500);
          res.send(JSON.stringify({ message: "Post Not Deleted" }));
        } else {
          res.status(200);
          res.send(JSON.stringify({ message: "Post Deleted" }));
        }
      });
    } else {
      res.status(401);
      res.send(JSON.stringify({ message: "User Not Authorized" }));
    }
  });

  app.post(
    "/post/new",
    notifications.newPostNotifications,
    async (req, res) => {
      await User.findOne(
        { enrollment_number: req.body.enrollment_number },
        async (err, user) => {
          if (err || !user) {
            console.log(chalk.red("User Not Found"));
            res.status(500);
            res.send(JSON.stringify({ message: "User Not Found" }));
          } else {
            const filename_hash = crypto.createHash("sha256");
            await filename_hash.update(req.body.image_string);
            const file_path = `/home/assets/images/posts/${filename_hash.digest(
              "hex"
            )}.png`;
            await fs.open(file_path, "w", function (err, file) {
              if (err) {
                console.log(chalk.red("Error Uploading Post 1"));
                res.send(JSON.stringify({ message: "Error Uploading Post" }));
              }
            });
            await fs.writeFile(
              file_path,
              req.body.image_string,
              { encoding: "base64" },
              (err) => {
                if (err) {
                  console.log(err);
                  console.log(chalk.red("Error Uploading Post 2"));
                  res.send(JSON.stringify({ message: "Error Uploading Post" }));
                }
              }
            );
            var data = {
              image_path: file_path.substr(5), // remove /home
              caption: req.body.caption,
              author: user,
            };
            await Post.create(data, (err, post) => {
              if (err) {
                console.log(chalk.red("Error Uploading Post"));
                res.send(JSON.stringify({ message: "Error Uploading Post" }));
              } else {
                console.log(chalk.green("Post Uplaoded Successfully!"));
                res.status(200);
                res.send(
                  JSON.stringify({ message: "Post Uploaded Successfully" })
                );
              }
            });
          }
        }
      );
    }
  );
};
