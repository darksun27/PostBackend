const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
var admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");

const sendNotification = require("../expo");

const getIndividualTokenFromFirebase = async (enrollment_number) => {
  let individualTokenSnapshot = await admin
    .database()
    .ref(`notification/individual/${enrollment_number}`)
    .once("value");
  if (!individualTokenSnapshot.val()) return "";
  let { token } = individualTokenSnapshot.val();
  return [token];
};
const getAllTokensFromFirebase = async () => {
  let individualTokenSnapshot = await admin
    .database()
    .ref(`notification/all/`)
    .once("value");
  let users = individualTokenSnapshot.val();
  let tokens = [];
  for (user in users) {
    let token = users[user];
    if (Expo.isExpoPushToken(token)) tokens.push(users[user]);
  }
  return tokens;
};

const postLikedNotifications = async (req, res, next) => {
  let {
    query: { username: current_like_username },
    params: { id: _id },
  } = req;
  let { author, caption } = await Post.findOne({ _id });
  let { enrollment_number: author_enrollment_number } = await User.findOne({
    _id: author,
  });

  let body = `${caption}`;
  let title = `${current_like_username} liked your post`;
  let data = {
    data: `${current_like_username} liked your post`,
    navigation: { drawer: "JIIT Social", screen: "viewpost", postId: _id },
  };

  let tokens = await getIndividualTokenFromFirebase(author_enrollment_number);

  sendNotification(data, tokens, body, title);
  next();
};

const newPostNotifications = async (req, res, next) => {
  let {
    body: { enrollment_number, caption, username },
  } = req;
  let body = `${caption}`;
  let title = `${username} added a new post`;
  let data = {
    data: `${username} added a new post`,
    navigation: { drawer: "JIIT Social", screen: "jiitsocial" },
  };

  let tokens = await getAllTokensFromFirebase();

  sendNotification(data, tokens, body, title);
  next();
};

const appNotifications = async (req, res, next) => {
  let {
    body: { password, drawer, screen, notificationBody, notificationTitle },
  } = req;
  if (password !== process.env.MODERATOR_PASSWORD) {
    next();
    return;
  }
  let body = notificationBody;
  let title = notificationTitle;
  let data = {
    data: notificationBody,
    navigation: { drawer, screen },
  };
  let tokens = await getAllTokensFromFirebase();
  sendNotification(data, tokens, body, title);
  next();
};

const newCommentNotifications = async (req, res, next) => {
  let {
    body: { comment_body, username },
    params: { id: _id },
  } = req;
  console.log(_id);
  let { author } = await Post.findOne({ _id });
  let { enrollment_number: author_enrollment_number } = await User.findOne({
    _id: author,
  });
  let body = `${comment_body}`;
  let title = `${username} commented on your post`;
  let data = {
    data: `${username} commented on your post`,
    navigation: { drawer: "JIIT Social", screen: "viewpost", postId: _id },
  };

  let tokens = await getIndividualTokenFromFirebase(author_enrollment_number);

  sendNotification(data, tokens, body, title);
  next();
};

module.exports = {
  postLikedNotifications,
  newPostNotifications,
  newCommentNotifications,
  appNotifications,
};
