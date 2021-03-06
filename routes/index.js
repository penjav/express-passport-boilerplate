var express = require('express');
var passport = require('passport');
var User = require('../schemas/user.js');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
	if(req.isAuthenticated()) {
		res.render("index", {title: req.user.email});
	} else {
		res.redirect('/login');
	}
});

router.get('/login', function(req, res, next) {
	if(req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('login', {});
	}
});

router.get('/signup', function(req, res, next) {
	res.render('signup', {});
});

router.post('/login',
		passport.authenticate('local', { successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: false })
		);

router.post('/signup', function (req, res, next) {
	console.log('signed up');
	var user = new User({username: req.body.username, email: req.body.email});
	User.register(user, req.body.password, function(registrationError) {
		if(!registrationError) {
			req.login(user, function(loginError) {
				if (loginError) { return next(loginError); }
				return res.redirect('/');
			});
		} else {
			res.send(registrationError);
		}
	});

});


module.exports = router;
