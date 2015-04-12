/*API ROUTES*/

var mongooseConfig = require('../.././config/api_config.js');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var jf = require('jsonfile');
var jwt  = require("jsonwebtoken");
var morgan = require('morgan');
var bcrypt = require('bcrypt');
var mailer = require('express-mailer');
var app = express();

var hostUrl = "http://localhost:3000";

mailer.extend(app, {
	from: 'redharvestredharvest@gmail.com',
	host: 'smtp.gmail.com', // hostname 
	secureConnection: true, // use SSL 
	port: 465, // port for secure SMTP 
	transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
	auth: {
		user: 'redharvestredharvest@gmail.com',
		pass: 'hi5mutthi5mutt'
	}
});



//connect to mongoose
//configure endpoint in ./config.api_config.js
mongoose.connect(mongooseConfig);

//use bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('views', './app/views');
app.set('view engine', 'jade');

//define router and models
var router = express.Router();
var Tab = require('../models/tab.js');
var User = require('../models/user.js');
var jwt_sharedsecret = "supersecretkeyhere12345";


function ensureAuthorized(req, res, next) {
		// should decode the token here to check if it has expired
		var bearerToken;
		var bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader !== 'undefined') {
				var bearer = bearerHeader.split(" ");
				bearerToken = bearer[1];
				req.token = bearerToken;
				User.findOne({token: req.token}, function(err, user){
					if(user.locked === false){
						next()
					}
		} else {
				res.send(403);
		}
}

function ensureAdmin(req, res, next) {
		// should decode the token here to check if it has expired
		var bearerToken;
		var bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader !== 'undefined') {
				var bearer = bearerHeader.split(" ");
				bearerToken = bearer[1];
				req.token = bearerToken;
				User.findOne({token: req.token}, function(err, user){
					if(user.privilege === 'admin'){
						next()
					}
					else{
						res.json({
							response: 403,
							message: "user is not admin"
						});
					}
				})
		} else {
				res.sendStatus(status);
		}
}

router.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
		next();
});


//Authenticate using email/password
//if the credentials are correct send the token
router.post('/authenticate', function(req, res) {
	//look up the email address
	User.findOne({email: req.body.email}, function(err, user){
		if(user){
			console.log("authenticating: "+user._id)
			//if the user exists, check the password against database
			bcrypt.compare(req.body.password, user.password, function(err, result) {
				//if there's an error report it
				if(err){
					res.json({
						result: false,
						data: "error occured: "+err
					})
				}
				//if the account is locked, send 403
				else if(user.locked){
					res.json({
							result: false,
							locked: true,	
							data: "Account is locked, reset password to unlock"
						})
				}
				//if the password matches, return the auth token
				else if(result === true && !user.locked){
					user.failedLoginAttempts = 0;
					user.save();
					res.json({
						result: true,	
						data: user.email,
						token: user.token
					})
				}
				//otherwise return incorrect message
				else{
					user.failedLoginAttempts++;
					if(user.failedLoginAttempts >= 3){
						user.locked = true;
					}
					user.save();
					res.json({
						result: false,
						message: "Incorrect Email/Password",
						failedAttempts: user.failedLoginAttempts,
						data: null
					})
				}

			})
		}
	})
});


//reset password/unlock account
router.post('/authenticate/resetpassword', function(req, res){
	User.findOne({_id:req.body.user_id}, function(err, user){
		//if there is a user
		if(user){
			//if the supplied reset token exists and matches the one generated
			if(user.resetToken && req.body.resetToken === user.resetToken){
				//hash the new password
				bcrypt.hash(req.body.password, 10, function(err, hash) {
					// Store hash in your password DB.
						user.password = hash;
						var toToken = {email: user.email, password: user.password}
						user.token = jwt.sign(toToken, jwt_sharedsecret);
						//reset security keys
						user.locked = false;
						user.resetToken = null;
						user.failedLoginAttempts = 0;
						user.save(function(err, user){
							if(err)
								res.send(err)
							res.json({message:'reset user', id: user._id})
						})
					})
			}
			else {
				res.json({result: false, message: "Supplied token does not exist or match"})
			}
		}
	})
})

//request to reset the password of an account
//should send an email to the user.email with the link to reset page
//resetToken should be in the link as a URL paramater 
router.post('/authenticate/requestreset', function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		if(err)
			res.send(err)

		//generate resetToken as a random 32char string
		function randomString(length, chars) {
			var result = '';
			for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
			return result;
		}
		var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
		
		//assign token to the user
		user.resetToken = rString;
		//lock their account, so they can't sign in while reset is in progress
		user.locked = true;
		//save the user
		user.save(function(err){
			if(err)
				console.log(err)
			console.log(user._id+" reqested password reset")
		})

		//send the reset email
		app.mailer.send('reset_password', {
			to: user.email, 
			subject: 'Reset Password for Tab It', // REQUIRED. 
			resetToken: user.resetToken,
			resetLink: hostUrl+"/resetpassword/"+user._id+"/"+user.resetToken
		}, function (err) {
			if (err) {
				// handle error 
				console.log(err);
				res.send('There was an error sending the email');
				return;
			}
			else {
				//return the result to the browser
				res.json({
					result: true,
					response: 200,
					message: "password reset instructions have been emailed to the user and account locked"
				})
			}
		})
	})
})

//middleware here
router.use(function(req, res, next){
	console.log(req.method+" request being made");
	next();
})


/* ================================
	USERS
================================ */

router.route('/users')
	.get(ensureAdmin, function(req, res){
		User.find(function(err, users){
			if(err)
				res.send(err)
			//filter the request to hide passwords etc...
			var filteredUsers = []
			for(u in users){
				filteredUsers.push({name: users[u].name, email:users[u].email})
			}
			res.json(filteredUsers)
		})
	})

	.post(function(req, res){
		User.findOne({email : req.body.email}, function(err, user){
			if(err){
				res.send(err)
			}
			else{
				if(user){
					res.json({message: 'user already exists'});
				}
				else{
					console.log("creating new user");
					user = new User();
					user.name = req.body.name;
					user.email = req.body.email;
					bcrypt.hash(req.body.password, 10, function(err, hash) {
					// Store hash in your password DB.
						user.password = hash;
						var toToken = {email: user.email, password: user.password}
						user.token = jwt.sign(toToken, jwt_sharedsecret);
						user.save(function(err, user){
							if(err)
								res.send(err)
							res.json({message:'created new user', created: user._id})
						})
					})
				}
			}
		})
	})

//Test the member lookup functionality
router.get('/users/me', ensureAuthorized, function(req, res) {
		User.findOne({token: req.headers.authorization}, function(err, user) {
			if (err) {
				res.json({
						response: false,
						data: "Error occured: " + err
				});
			} else {
				res.json({
						response: true,
						data: {name: user.name, email: user.email}
				});
			}
	});
});


/* ================================
	TABS
================================ */

router.route('/tabs')
	.get(ensureAuthorized, function(req, res){
		Tab.find().populate(['owner', 'members']).exec(function(err, tabs){
			if(err)
				res.send(err)
			res.json(tabs)
		})
	})

	.post(function(req, res){
		var response = {};
		tab = new Tab();
		tab.name = req.body.name;

		//owner should be set using headers once Auth is implemented
		tab.owner = req.body.user_id;

		// this function looks up existing members by email
		if(req.body.member_email){
			User.findOne({email:req.body.member_email}, function(err, user){
				if(user){
					console.log("new tab has existing user: "+user._id)
					tab.members.push(user._id);
					tab.members.push(req.body.user_id);
					response.members = tab.members;
					tab.save()
				}
				else {
					response.member = null;
				}
			})
		}

		tab.save(function(err){
			if(err)
				res.send(err)
			response.message = "Created new tab successfully";
			response.created = tab;
			res.json(response)
		})
	})





/* ================================
	GLOBAL
================================ */

// return some response at root
router.get('/', function(req, res){
	res.json({ message: 'Welcome to our api!' });
});


//export to server
module.exports = router;

