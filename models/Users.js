'use strict'

/**
 * Created by ekerot on 2016-12-09.
 */

const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');

//defining a schema for the login
let userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, maxlength: 30},
    name: {type: String, required: true, maxlength: 30},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true, minlength: 8} // pre save validation is runned before self assigned pre saves
});

//making a pre dave that hashing the password
userSchema.pre('save', function(next) {

    let user = this;

    bcrypt.genSalt(10, function(err, salt){  //let´ salt it aswell!
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

//comparing passwords to authenticate user
userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, res){

        if(err){
            return callback(err);
        }

        callback(null, res);
    })
};

let User = mongoose.model("User", userSchema);

// export the object
module.exports = User;
