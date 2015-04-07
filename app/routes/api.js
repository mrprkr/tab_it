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
var app = express();

//connect to mongoose
//configure endpoint in ./config.api_config.js
mongoose.connect(mongooseConfig);

//use bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//define router and models
var router = express.Router();
var Tab = require('../models/tab.js');
var User = require('../models/user.js');



function ensureAuthorized(req, res, next) {
		// should decode the token here to check if it has expired
		var bearerToken;
		var bearerHeader = req.headers["authorization"];
		if (typeof bearerHeader !== 'undefined') {
				var bearer = bearerHeader.split(" ");
				bearerToken = bearer[1];
				req.token = bearerToken;
				next();
		} else {
				res.json({response: 403, message:"You aren't logged in"});
		}
}

router.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
		next();
});

router.post('/authenticate', function(req, res) {
	//look up the email address
	User.findOne({email: req.body.email}, function(err, user){
			if(user){
				console.log("authenticating: "+user.name)
				//if the user exists, check the password against database
				bcrypt.compare(req.body.password, user.password, function(err, result) {
					//if there's an error report it
					if(err)
						res.json({
							result: false,
							data: "error occured: "+err
						})
					//if the password matches, return the auth token
					if(result === true)
						res.json({
							result: true,	
							data: user.email,
							token: user.token
						})
					//otherwise return incorrect message
					else
						res.json({
							result: false,
							data: "Incorrect Email/Password"
						})
				});
			}
		//return the same message if the email isn't found
		else
			res.json({
				result: false,
				data: "Incorrect Email/Password"
			})
	})
});


// router.post('/signin', function(req, res) {
//     User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
//         if (err) {
//             res.json({
//                 type: false,
//                 data: "Error occured: " + err
//             });
//         } else {
//             if (user) {
//                 res.json({
//                     type: false,
//                     data: "User already exists!"
//                 });
//             } else {
// 		          	console.log("creating new user")
//                 var userModel = new User();
//                 userModel.email = req.body.email;
//                 userModel.password = req.body.password;
//                 userModel.save(function(err, user) {
//                     user.token = jwt.sign(user, '12322345');
//                     user.save(function(err, user1) {
//                         res.json({
//                             type: true,
//                             data: user1,
//                             token: user1.token
//                         });
//                     });
//                 })
//             }
//         }
//     });
// });

//middleware here
router.use(function(req, res, next){
	console.log(req.method+" request being made");
	next();
})


/* ================================
	USERS
================================ */

router.route('/users')
	.get(function(req, res){
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
						user.token = jwt.sign(user, "supersecretkeyhere12345");
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
	GLOBAL
================================ */

// return some response at root
router.get('/', function(req, res){
	res.json({ message: 'Welcome to our api!' });
});


//export to server
module.exports = router;

