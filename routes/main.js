'use strict';

/**
 * Created by ekerot on 2016-11-30.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.route('/')    //function just to show snippets first page
    .get(function(req, res) {
        SnippetDB.find({}, function (err, snippets) {

           let context = {            //creating context variable to send to view

                snippets: snippets.map(function(snippets){
                    return {
                        username: snippets.username,
                        name: snippets.name,
                        snippet: snippets.snippet,
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
                console.log(err.message)
            }

            res.render('main/snippets', context);

        });
    });

module.exports = router;
