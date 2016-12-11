'use strict'

/**
 * Created by ekerot on 2016-12-09.
 */

let mongoose = require("mongoose");
let bcrypt = require('bcrypt-nodejs');

var minlength = [8, 'The value of your password is shorter than the minimum allowed length ({MINLENGTH}).'];
var maxlength = [30, 'The value of your username is greater than the maximum allowed length ({MAXLENGTH}).'];

//defining a schema for the login
let userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, maxlength: maxlength},
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true, minlength: minlength}
});

userSchema.pre('save', function(next) {

    let user = this;

    bcrypt.genSalt(10, function(err, salt){
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
