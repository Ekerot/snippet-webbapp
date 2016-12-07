'use strict';

/**
 * Created by ekerot on 2016-11-30.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.route('/')
    .get(function(req, res) {
        res.render('main/index');
    });

router.route('/snippets')
    .get(function(req, res) {

        SnippetDB.find({}, function (err, snippets) {

            let context = {
                snippets: snippets.map(function(snippets){
                    return {
                        name: snippets.name,
                        id: snippets._id,
                    }
                })
            };

            if (err) {
                res.render('main/snippets', {
                    flash: {
                        type: 'danger',
                        intro: 'Something went wrong!',
                        text: err.message},
                });
            }

            res.render('main/snippets', context);

        });
    });

router.route('/show/:id')
    .get(function(req, res) {

        SnippetDB.findById( {_id: req.params.id} , function(err, snippet){

            if(err){
                res.render('main/snippets', {
                    flash: {
                        type: 'danger',
                        intro: 'Something went wrong!',
                        text: err.message},
                });
            }
            res.render('main/show', snippet);
        });
    });


router.route('/create')
    .get(function (req, res) {
        res.render('main/create');

    })
    .post(function (req, res) {

        new SnippetDB({

            name: req.body.name,
            snippet: req.body.snippet

        }).save();

        req.session.flash = {
            type: 'success',
            message: 'You have created a snippet successfully! Congratulations!'
        };

        res.redirect('/snippets');
    });


module.exports = router;
