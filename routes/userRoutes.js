const mongoose = require('mongoose');
const chalk = require('chalk');

const User = mongoose.model('User');

module.exports = (app)=> {
    app.post('/registerUser', async (req, res)=> {
        var data = {
            enrollment_number: req.body.enrollment_number,
            user_type: req.body.user_type || 'USER'
        };
        await User.create(data, (err, user)=> {
            if(err) {
                console.log(chalk.red("Error Registering User"), chalk.yellow(data.enrollment_number));
                res.send(JSON.stringify({ message: "Error Registering User" }));
            }else {
                console.log(chalk.green("User Successfully Registered"));
                res.status(200);
                res.send(JSON.stringify({ message: "User Registered" }))
            }
        })
    })
};