'use strict';

/**
 * Created by ekerot on 2016-12-10.
 */

/**
 * Function registering new user
 * Input from form at createlogin.handlebars
 * Output stored in dbs
 */

let router = require('express').Router();
let Users = new require('../models/Users');

router.route('/register').get(function(req, res) {
    res.render('login/createlogin');
})
    .post(function (req, res) {

        let user = new Users({  //creating new user from input

            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

        });

        user.save()   // saving new user to the database and give a message to user
            .then(function () {
                req.session.flash = {type: 'success', message: 'You have registered successfully! Congratulations!'};
                res.redirect('/');

            }).catch(function (err) { //if catching error give message to user

            if (err.name === 'ValidationError' && err.errors.password) {
                req.session.flash = {
                    type: 'danger',
                    message: 'Your password has to be at least 8 characters long!!'
                };
            }

            else if (err.name === 'ValidationError' && err.errors.username) {
                req.session.flash = {
                    type: 'danger',
                    message: 'Your username can´t be longer then 30 characters!!'
                };
            }

            else if (err.message.includes('$email')) {
                req.session.flash = {
                    type: 'danger',
                    message: 'An account already registered with that email!'
                };

            }

            else if (err.message.includes('$username')) {
                req.session.flash = {
                    type: 'danger',
                    message: 'The username is already taken, try another one!'
                };
            }

           else {
                req.session.flash = {
                    type: 'danger',
                    message: err.message
                };

            }

            res.redirect("/register");  //redirecting back to register if no success

        });
    });

module.exports = router;
