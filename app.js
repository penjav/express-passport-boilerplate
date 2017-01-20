var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./schemas/user.js');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://6148inclass:eurvXuWZT994zi2KdCvkEEQVzCoGdCCMOuFnL8n3wysASk2ayMTyuUqHhMZgiDMivmokTXFYUfRYf8hNYCAjzg==@6148inclass.documents.azure.com:10250/db?ssl=true');
/*
   Example localhost: 'mongodb://localhost:27017/test';
   Example Azure URI: mongodb://aaronsmongodbrw:xSJEozk4Tmg74Q1iyXMN0sEgr0PfegnIrDz5xq8N5UvmwlsFSSqGR0QMAx1nw5hdiENdcSQbHHK7t4ZQY0wf6g==@aaronsmongodbrw.documents.azure.com:10250/<db_name>?ssl=true
   Example Heroku (MongoLab) URI: 'mongodb://<db_user>:<db_pass>@ds117919.mlab.com:17919/heroku_n54n38l8';
   */
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.on('connected', function() {
	console.log('database connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport stuff
app.use(session({ secret: 'my super secret secret', resave: 'false', saveUninitialized: 'true' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

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
