"use strict";

/**
 * Created by ekerot on 2016-11-29.
 */

//------------SETUP-------------------------------------
const express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
let mongoose = require('./config/mongoose.js');

const app = express();
const port = process.env.PORT || 8000;

//------------CONFIGURATIONS----------------------------

app.engine('handlebars', hbs({
    defaultLayout: 'main',
    layoutDir: __dirname + '/views/layouts',
    partialsDir  : [__dirname + '/views/partials',]
}));

app.set('view engine', 'handlebars');

mongoose();  //start db

//parsing json and form data
app.use(bodyParser.urlencoded({ extended: true }));

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name:   "thesnippetserversession",
    secret: "8kdDkdfn3948skjfi9JD9jdke24",
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
    }
}));

//use flash messages
app.use(function(req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;

    next();
});

//routes
app.use('/', require('./routes/main.js'));

//errors on server
app.use((req, res) => res.status(404).render('errors/404'));

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(400).render('errors/400')
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render("errors/500");
});


//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
+ '\nIf you want to terminate press ctrl+c'));
