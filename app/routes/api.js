/*API ROUTES*/

var mongooseConfig = require('../.././config/api_config.js');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var jf = require('jsonfile');
var app = express();

//connect to mongoose
//configure endpoint in ./config.api_config.js
mongoose.connect(mongooseConfig);

//use bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define router and models
var router = express.Router();
var Tab = require('../models/tab.js');
var User = require('../models/user.js');



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
			res.json(users)
		})
	})

	.post(function(req, res){
		user = new User();
		user.name = req.body.name;
		user.email = req.body.email;

		user.save(function(err, user){
			if(err)
				res.send(err)
			res.json({message:'created new user', created: user})
		})
	});


/* ================================
	TABS
================================ */

router.route('/tabs')
	.get(function(req, res){
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
router.route('/user/:email')
	.get(function(req, res){
		console.log("Reqesting member, looking up by email")
		User.findOne({email:req.params.email}, function(err, user){
			if(user){
				res.json(user)
			}
			else{
				res.json({message:"no member found"})
			}
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

