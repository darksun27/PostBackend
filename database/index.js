require('dotenv').config();
const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, keepAlive: true, useUnifiedTopology: true }).then(()=> {
        console.log("Database Connected");
    }).catch((err)=> {
        console.log("Database Connection Error");
    });
}

function disconnect() {
    mongoose.connection.close().then(()=> {
        console.log(chalk.green("Database Disconnected Successfully!"));
    }).catch((err)=> {
        console.log(chalk.red("Could not disconnect from database!\n Error:\n", err))
    })
}

module.exports = {
    connect,
    disconnect
};