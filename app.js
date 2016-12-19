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
const mongoose = require('./config/mongoose.js');
const helmet = require('helmet')

const app = express();
app.use(helmet());
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

app.use(session({   //create a session
    name:   "thesnippetserversession",
    secret: "8kdDkdfn3948skjfi9JD9jdke24",
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
    },
    maxAge: 3600000
}));

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

//use flash messages
app.use(function(request, response, next) {
    if(request.session.flash) {
        response.locals.flash = request.session.flash;
        delete request.session.flash;
    }
    next();
});

//routes
app.use('/', require('./routes/main.js'));
app.use('/', require('./routes/snippets.js'));
app.use('/', require('./routes/register.js'));
app.use('/', require('./routes/userSession.js'));

//errors on server
app.use((req, res) => res.status(404).render('errors/404'));

app.use((err, req, res) => {
    res.status(400).render('errors/400')
});

app.use((err, req, res) => {
    res.status(403).render('errors/403')
});

app.use((err, req, res) => {
    res.status(500).render("errors/500");
});


//console what port that the app uses
app.listen(port, () => console.log(`Express app listening on port ${port}!`
+ '\nIf you want to terminate press ctrl+c'));
