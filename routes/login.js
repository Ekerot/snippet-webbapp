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

        let userSchema = new Users({

            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            reemail: req.body.reemail,
            password: req.body.password,
            repassword: req.body.repassword

        });

        userSchema.path('password', validate(function(password){
            return password.length >= 8;
        }));

        userSchema.pre('save', function(next) {

            let user = this;

            bcrypt.genSalt(15, function(err, salt){
                if(err){
                    return next(err);
                }

                bcrypt.hash(user.password, salt, null, function(err, hash){

                    if(err){
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        });

        userSchema.save()
            .then(function () {
                req.session.flash = {type: 'success', message: 'You have registered successfully! Congratulations!'};
                res.redirect('/');

            }).catch(function (err) {

            req.session.flash = {
                type: 'danger',
                intro: 'Something went wrong!',
                message: err.message
            };

            res.redirect("/create");

        });
    });

module.exports = router;
