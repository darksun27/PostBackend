require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const multer = require("multer");
const connectDB = require("./database/index.js");
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jiitcompanion-new-4c6fb.firebaseio.com",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());
app.use("/assets", express.static(__dirname + "/assets"));

connectDB.connect();

//Importing Database Models
require("./models/userModel");
require("./models/commentModel");
require("./models/postModel");
require("./models/messMenuModel");

//Importing Routes
require("./routes/userRoutes")(app);
require("./routes/postRoutes")(app);
require("./routes/commentRoutes")(app);
require("./routes/messRoutes")(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started!");
  console.log("Listening on PORT ", chalk.inverse.green(server.address().port));
});

process.on("SIGINT", () => {
  console.log(chalk.red("\nServer Turn off Sequence Initiated!"));
  console.log(chalk.yellow("Disconnecting from Database"));
  connectDB.disconnect();
  console.log(chalk.yellow("Closing Server!"));
  server.close();
  console.log(chalk.green("Turn Off Sequence Complete! Exiting"));
  process.exit(1);
});
