const mongoose = require('mongoose');
const chalk = require('chalk');
const MessMenu = mongoose.model('MessMenu');
const User = mongoose.model('User');

module.exports = (app)=> {
    app.post("/uploadMenu", (req, res)=> {
        User.findOne({enrollment_number: req.body.enrollment_number}, (err, user)=>{
            if(err || !user) {
                console.log(chalk.red("User Not Found Enrollment Number: "), chalk.yellow(req.body.enrollment_number));
                res.status(500);
                res.send(JSON.stringify({ message: "User Not Found" }));
            }else {
                var data = {
                    image_string : req.body.image_string,
                    author: {
                        username: req.body.username,
                        id: user
                    }
                }
                MessMenu.create(data, (err, upload)=> {
                    if(err) {
                        console.log(chalk.red("Error Uploading Mess Menu"));
                        res.send(JSON.stringify({ message: "Error Uploading Menu" }));
                    }else {
                        console.log(chalk.green("Mess Menu Uplaoded Successfully!"));
                        res.status(200);
                        res.send(JSON.stringify({ message: "Menu Uploaded Successfully" }));
                    }
                });
            }
        });
    });
};