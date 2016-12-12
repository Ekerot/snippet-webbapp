'use strict';

/**
 * Created by ekerot on 2016-12-07.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.route('/update/:id')
    .get(function(req, res) {

        if (req.session && req.session.user) {

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
            res.render('errors/403');
        }
});

router.post('/confirmed/:id', function (req, res) {

    if (req.session && req.session.user) {

        SnippetDB.findOneAndUpdate({_id: req.params.id}, {snippet: req.body.usnippet}, (err, updatedSnippet, next) => {
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

        res.render('errors/403')

    }

});


router.post("/delete/:id", function (req, res, next) {

    if (req.session && req.session.user) {
        SnippetDB.findOneAndRemove({_id: req.params.id}, function (err) {
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
        res.render('errors/403')
    }
});


router.route('/create')
    .get(function (req, res, next) {

        if (req.session && req.session.user) {

            res.render('main/create');

        }

        else {
            res.render('errors/403')
        }

    })
    .post(function (req, res) {


        let newSnippet = new SnippetDB({

            username: req.session.user.username,
            name: req.body.name,
            snippet: req.body.snippet

        });

        newSnippet.save()
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
