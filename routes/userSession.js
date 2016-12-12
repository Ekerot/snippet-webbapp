'use strict';

/**
 * Created by ekerot on 2016-12-11.
 */

//TODO - Fix bug - when trying to register with same username as already exists in the dbs send error message - why Unhandled promise rejection ??

let router = require('express').Router();
let Users = new require('../models/Users');

router.post('/login', function(req,res){

    Users.findOne({username: req.body.username}, function(err, user) {

        if(!user){
            req.session.flash = {
                type: 'danger',
                message: 'No user exists with that username!'
            };
            res.redirect('/');
        }

        else {

            user.comparePassword(req.body.password, function (err, userpass) {
                if (err) {
                    res.status(422).send('problem', err.message)
                } else if (!userpass) {
                    console.log(err);
                    req.session.flash = {
                        type: 'danger',
                        message: 'You have entered wrong password!'
                    };
                    res.redirect('/')
                } else {
                    req.session.flash = {
                        type: 'success',
                        message: 'You are logged in!'
                    };

                    res.locals.session = req.session;

                    req.user = user;
                    delete req.user.password;
                    req.session.user = user;
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
