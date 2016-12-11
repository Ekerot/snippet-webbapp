/**
 * Created by ekerot on 2016-12-07.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.route('/update/:id')
    .post(function (req, res) {

        SnippetDB.findOneAndUpdate({_id: req.params.id}, {snippet: req.body.snippet},(err, updatedSnippet, next) => {
            if(err) {
                next(err);
            }
        });

        req.session.flash = {
            type: "success",
            message: "Your snippet is updated!"
        };

        res.redirect("/");

    });


router.route("/delete/:id")
    .post(function(req, res, next) {
        SnippetDB.findOneAndRemove({_id: req.params.id}, function(err) {
            if(err) {
                next(err);
            }
        });
        req.session.flash = {
            type: "success",
            message: "Your snippet is deleted!"
        };
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
