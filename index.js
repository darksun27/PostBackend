require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const connectDB = require('./database/index.js');
const app = express();

connectDB.connect();

app.use()

const server = app.listen(process.env.PORT || 3000, process.env.IP || "localhost", ()=> {
    console.log("Server Started!");
    console.log("Listening on PORT ", chalk.inverse.green(server.address().port), "IP ", chalk.inverse.green(server.address().address));
});

process.on('SIGINT', ()=> {
    console.log(chalk.red("\nServer Turn off Sequence Initiated!"));
    console.log(chalk.yellow("Disconnecting from Database"));
    connectDB.disconnect();
    console.log(chalk.yellow("Closing Server!"));
    server.close();
    console.log(chalk.green("Turn Off Sequence Complete! Exiting"));
    process.exit(1);
})