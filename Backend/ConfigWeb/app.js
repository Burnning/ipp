var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

global.path = require('path');
global.config = require('./package').config;
global.moment = require('moment');
global.logger = require('./utils/log4js').Logger;
global.helper = require('./utils/helper');
global._=require('underscore');
global.util =require('util');
global.dirPath = __dirname;
global.async = require('async');
global.requestClient = require('request-json');
global.tempSource = [];

var routes = require('./routes/index');
var dimension = require('./routes/dimension');
var pattern = require('./routes/pattern');
var param = require('./routes/param');
var source = require('./routes/source');
var datatype = require('./routes/datatype');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'gbtouch',
    key:'gbtouch',
    cookie:{maxAge:1000*60*60*24*30},//30 days
    resave: false,
    saveUninitialized: false
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log('[HEAD]' + req.method + ' ' + req.url);
    console.log('[BODY]' + JSON.stringify(req.body));
    //var err = new Error('Not Found');
    //err.status = 404;
    next();
});

app.use('/', routes);
app.use('/dimension', dimension);
app.use('/pattern', pattern);
app.use('/param',param);
app.use('/source',source);
app.use('/datatype',datatype);
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
