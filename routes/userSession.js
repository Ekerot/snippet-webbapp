'use strict';

/*
 * Created by ekerot on 2016-12-11.
 */

let router = require('express').Router();
let Users = new require('../models/Users');

router.post('/login', function(req,res){

    Users.findOne({username: req.body.username}, function(err, user) {

        user.comparePassword(req.body.password, function(err, userpass){
            if(err){
                res.status(422).send('problem',err.message)
            } else if(!userpass){
                console.log(err);
                req.session.flash = {
                    type: 'danger',
                    message: 'You have entered wrong password!'
                };
            } else {
                res.redirect('/')
            }
        });
    });


});

module.exports = router;
