/*API ROUTES*/

var mongooseConfig = require('../.././config/api_config.js')
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
// var House = require('../models/house.js');
var Tab = require('../models/tab.js');
var User = require('../models/user.js');

//middleware here
router.use(function(req, res, next){
	console.log(req.method+" request being made");
	next();
})

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
			res.json({message:'created successfully'})
		})
	});

router.route('/tabs')
	.get(function(req, res){
		Tab.find().populate('owner').exec(function(err, tabs){
			if(err)
				res.send(err)
			res.json(tabs)
		})
	})

	.post(function(req, res){
		tab = new Tab();
		tab.name = req.body.name;
		tab.owner = req.body.user_id;
		
		tab.save(function(err, tab){
			if(err)
				res.send(err)
			res.json({message:'created successfully', created: tab})
		})
	})


//============================
// Global
//============================

// return some response at root
router.get('/', function(req, res){
	res.json({ message: 'Welcome to our api!' });
});


//export to server
module.exports = router;

