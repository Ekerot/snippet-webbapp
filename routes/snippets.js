'use strict';

/**
 * Created by ekerot on 2016-12-07.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.route('/update/:id')  //function to send information for view
    .get(function(req, res) {

        if (req.session && req.session.user) {  //authorize

                SnippetDB.find({_id: req.params.id}, function (err, snippets) {

                    let context = {
                        snippets: snippets.map(function(snippets){
                            return {
                                username: snippets.username,
                                uname: snippets.name,
                                usnippet: snippets.snippet,
                                id: snippets._id,
                            }
                        })
                    };

                    if (err) {
                        res.render('main/snippets', {
                            flash: {
                                type: 'danger',
                                intro: 'Something went wrong!',
                                message: err.message},
                        });

                    }

                    res.render('main/update', context);

                });
            }

            else{
            res.render('errors/401');
        }
});

router.post('/confirmed/:id', function (req, res) { //function to update snippets

    if (req.session && req.session.user) {  // authorize

        SnippetDB.findOneAndUpdate({_id: req.params.id}, {snippet: req.body.usnippet}, (err, updatedSnippet, next) => { //find snippet  and change/update
            if (err) {
                next(err);
            }
        });

        req.session.flash = {
            type: "success",
            message: "Your snippet is updated!"
        };

        res.redirect("/");

    }

    else {

        res.render('errors/401')

    }

});


router.post("/delete/:id", function (req, res, next) {  //delete function using findAndRemove method. For snippet

    if (req.session && req.session.user) { //authorize

        SnippetDB.findOneAndRemove({_id: req.params.id}, function (err) { //find snippet in dbs
            if (err) {
                next(err);
            }
        });
        req.session.flash = {
            type: "success",
            message: "Your snippet is deleted!"
        };

        res.redirect("/");

    }
    else {
        res.render('errors/401') // rendering 403 if not authorized
    }
});


router.route('/create')  //create function to create snippet
    .get(function (req, res, next) {

        if (req.session && req.session.user) {  //authorize user with session

            res.render('main/create');

        }

        else {
            res.render('errors/401') //if not authorized
        }

    })
    .post(function (req, res) {


        let newSnippet = new SnippetDB({  //creating schema and for new snippet

            username: req.session.user.username, //needs to get the username from the user-collection in dbs
            name: req.body.name,
            snippet: req.body.snippet

        });

        newSnippet.save()  // save snippet
            .then(function () {
                req.session.flash = {
                    type: 'success',
                    message: 'You have created a snippet successfully! Congratulations!'
                };
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
