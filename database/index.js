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
    mongoose.connection.close();
}

module.exports = {
    connect,
    disconnect
};