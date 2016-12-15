'use strict';

/**
 * Created by ekerot on 2016-12-11.
 */

let router = require('express').Router();
let Users = new require('../models/Users');

router.post('/login', function(req,res){ //login user

    Users.findOne({username: req.body.username}, function(err, user) { //search for user name

        if(!user){  //if user does not exist in dbs
            req.session.flash = {
                type: 'danger',
                message: 'No user exists with that username!'
            };
            res.redirect('/');
        }

        else {

            user.comparePassword(req.body.password, function (err, userpass) {  //compare passwords method is find in Users.js
                if (err) {
                    res.status(422).send('problem', err.message);

                } else if (!userpass) {  //if user password does not match

                    console.log(err);

                    req.session.flash = {
                        type: 'danger',
                        message: 'You have entered wrong password!'
                    };

                    res.redirect('/');

                } else {

                    req.session.flash = {
                        type: 'success',
                        message: 'You are logged in!'
                    };

                    req.session.user = user;
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/logout', function(req, res) {  //logout function

    req.session.destroy();  //destroy session
    res.redirect('/');
});

module.exports = router;
