/**
 * Created by ekerot on 2016-12-07.
 */

let routers = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

routers.route("/show")
    .get(function(req, res) {

        SnippetDB.find({}, function (err, snippets) {
            console.log(snippets);
            res.render("main/show", {snippets: snippets});
            if (err) {
                res.render("main/show", {
                    flash: {type: "danger", text: err.message},
                });
            }
        });
    });

routers.route("/show")
    .get(function(req, res) {

        SnippetDB.find({}, function (err, snippets) {
            console.log(snippets);
            res.render("main/show", {snippets: snippets});
            if (err) {
                res.render("main/show", {
                    flash: {type: "danger", text: err.message},
                });
            }
        });
    });


routers.route("/create")
    .get(function (req, res) {
        res.render("main/create", {snippetName: undefined, theSnippet: undefined});

    })
    .post(function (req, res) {

        let snippetName = req.body.snippetName;
        let theSnippet = req.body.theSnippet;


        console.log(theSnippet);

        let snippet = new SnippetDB({
            name: snippetName,
            snippet: theSnippet
        });

        snippet.save()
            .then(function () {
                res.redirect(303, '/show');

                request.session.flash = {
                    type: 'sucess',
                    text: 'You have created a snippet sucessfully! Congratulations!'
                };
            }).catch(function(err){
            console.log(err.message)
        })
    });

module.exports = routers;
