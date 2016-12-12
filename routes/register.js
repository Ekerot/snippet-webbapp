'use strict'

/**
 * Created by ekerot on 2016-12-10.
 */

let router = require('express').Router();
let Users = new require('../models/Users');
let bcrypt = require('bcrypt-nodejs');

router.route('/register').get(function(req, res) {
    res.render('login/createlogin');
})
    .post(function (req, res) {

        let user = new Users({

            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

        });

        user.save()
            .then(function () {
                req.session.flash = {type: 'success', message: 'You have registered successfully! Congratulations!'};
                res.redirect('/');

            }).catch(function (err) {

                req.session.flash = {
                    type: 'danger',
                    message: err.message
                };

                req.session.flash = {
                    type: 'danger',
                    message: err.errors.password.message
                };

                console.log(err.stack)

            res.redirect("/register");

        });
    });

module.exports = router;
