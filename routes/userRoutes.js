const mongoose = require('mongoose');
const chalk = require('chalk');

const User = mongoose.model('User');

module.exports = (app)=> {
    app.post('/registerUser', async (req, res)=> {
        var data = {
            enrollment_number: req.body.enrollment_number,
            user_type: req.body.user_type || 'USER',
            username: req.body.username
        };
        await User.find({ enrollment_number: data.enrollment_number }, async (err, user)=> {
            if(err) {

            }else {
                if(user.length == 0) {
                    await User.create(data, (err, user)=> {
                        if(err) {
                            console.log(chalk.red("Error Registering User"), chalk.yellow(data.enrollment_number));
                            res.send(JSON.stringify({ message: "Error Registering User" }));
                        }else {
                            console.log(chalk.green("User Successfully Registered"));
                            res.status(200);
                            res.send(JSON.stringify({ message: "User Registered" }))
                        }
                    });
                }else {
                    res.status(200);
                    res.send(JSON.stringify({ message: "User Already Registered", user: user}));
                }
            }
        })
    });

    app.post('/changeUsername', async (req, res)=> {
        await User.findOneAndUpdate({ enrollment_number: req.body.enrollment_number }, { username: req.body.username }, (err, user)=> {
            if(err) {
                res.status(500);
                res.send(JSON.stringify({ message: "Username updation failed" }));
            } else {
                res.status(200);
                res.send(JSON.stringify({ message: "Username updation successful" }));
            }
        });
    });
};