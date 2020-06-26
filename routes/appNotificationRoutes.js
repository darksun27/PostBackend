const notifications = require("../middlewares/notification");

module.exports = (app) => {
  app.post(
    "/appNotifications",
    notifications.appNotifications,
    async (req, res) => {
      res.status(200);
      res.send(JSON.stringify({ message: "Request Registered" }));
    }
  );
};
