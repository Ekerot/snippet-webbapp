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
                        createdAt: snippets.createdAt,
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

            else {

                res.render('main/snippets', context);

            }

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
                        message: err.message},
                });
            }
            res.render('main/show', snippet);
        });
    });

router.route('/update/:id')
    .post(function (req, res) {

        SnippetDB.findById({
            _id: req.params.id}, function (err, snippet) {
            if (err) return err;

            snippet.snippet = snippet;
            snippet.save(function (err, updatedSnippet) {
                if (err) return err;
                res.send(updatedSnippet);
            });

            req.session.flash = {
                type: "success",
                message: "Your snippet is updated!"
            };
            res.redirect("/snippets");
        });
    });

router.route("/delete/:id")
    .post(function(req, res, next) {
        SnippetDB.findOneAndRemove({_id: req.params.id}, function(err) {
            if(err) {
                next(err);
            }

            req.session.flash = {
                type: "success",
                message: "Your snippet is deleted!"
            };
            res.redirect("/snippets");
        });

    });

router.route('/create')
    .get(function (req, res) {
        res.render('main/create');

    })
    .post(function (req, res) {

        let newSnippet = new SnippetDB({

            name: req.body.name,
            snippet: req.body.snippet

        });

        newSnippet.save()
            .then(function () {

            req.session.flash = {type: 'success', message: 'You have created a snippet successfully! Congratulations!'};
            res.redirect('/snippets');

            }).catch(function (err) {
            if (err.errors.value.name === "ValidatorError") {  //handle if the requirements from the schema is not met

                return res.render("main/create", {
                    validationErrors: [err.errors.value.message],
                    value: req.body.value
                });
            }
        });
    });



module.exports = router;
