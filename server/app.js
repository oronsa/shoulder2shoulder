
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('../config.json');
var session = require('client-sessions');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    cookieName : 'session',
    secret : 'shoulderSecret',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));


app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../'));

app.use('/api/authentication', require('./routes/authentication'));
app.use('/api/database', require('./routes/database'));
app.use('/api/session', require('./routes/session'));

app.all('*', function(request, response) {
    response.sendFile('index.html', {
        root : __dirname + '/../client'
    });
}); 

app.use(function(request, response) {
    response.redirect('/');
});


module.exports = app;