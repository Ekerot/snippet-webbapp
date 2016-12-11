/**
 * Created by ekerot on 2016-12-07.
 */

let router = require('express').Router();
let SnippetDB = new require('../models/SnippetDB');

router.post('/update/:id',function (req, res) {

    if(req.session && req.session.user){

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

    }

    else{

        res.render('errors/403')

    }
});


router.post("/delete/:id", function(req, res, next) {

    if(req.session && req.session.user){
        SnippetDB.findOneAndRemove({_id: req.params.id}, function(err) {
            if(err) {
                next(err);
            }
        });
        req.session.flash = {
            type: "success",
            message: "Your snippet is deleted!"
        };

        res.redirect("/");

    }
    else{
        res.render('errors/403')
    }
});



router.route('/create')
    .get(function (req, res, next) {

        if(req.session && req.session.user) {

            res.render('main/create');

        }

        else{
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
