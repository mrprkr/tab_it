var mongooseConfig = require('../.././config/api_config.js')
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//connect to mongoose
//configure endpoint in ./config.api_config.js
mongoose.connect(mongooseConfig);

//use a bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define router and models
var router = express.Router();
var Transaction = require('../models/transaction.js');
var House = require('../models/house.js');
var User = require('../models/user.js');


//middleware here
router.use(function(req, res, next){
	console.log("api request being made");
	next();
})


//============================
// Houses
//============================

//Create a new house
router.route('/house')
	.post(function(req, res){
		var house = new House();
		house.name = req.body.name;
		house.users = [];
		house.transactions = [];
		if(house.name){
			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'new house created', 'house_id': house._id})
			})
		}
	})

//find an existing house by ID
router.route('/house/:house_id')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			res.json(house)
		})
	})

	//delete a house by ID
	.delete(function(req, res){
		if(req.headers.host === 'localhost:8080'){
			House.remove({_id : req.body.house_id}, function(err){
				if(err)
					res.send(err)
				res.json({'message':'house deleted'})
			})
		}
		else {
			console.log("unauth delete request")
			res.json({'message':'not authorised to delete'})
		}
	})

// get a list of all houses
router.route('/houses')
	.get(function(req, res){
			House.find(function(err, houses){
				if(err)
					res.send(err)
				res.json(houses)
			})
	});


//============================
// Transactions
//============================

// add a new transaction to a house
router.route('/house/:house_id/transactions/new')
	.post(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)

			var transaction = new Transaction();
			transaction.name = req.body.name;
			transaction.amount = req.body.amount;
			transaction.payerId = req.body.payerId;
			transaction.split = req.body.split;
			
			house.transactions.push(transaction);
			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'pushed new transaction to: '+house.name})
			})
		})
});

// get all transactions for a house
router.route('/house/:house_id/transactions')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			var transactions = house.transactions;
			res.json(transactions);
		})
	})

//get a specific transaction
router.route('/house/:house_id/transactions/:transaction_id')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			for(t in house.transactions){
				if(house.transactions[t]._id == req.params.transaction_id){
					res.json(house.transactions[t])
				}
				//need to add en else statement that sends error if not founde
				//without sending after EVERY loop or overiding good response
				// res.json({message:"not found or does not exist"})
			}
		})
	})

	//delete a specifiv transaction
	.delete(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			for(t in house.transactions){
				if(house.transactions[t]._id == req.params.transaction_id){
					console.log(house.transactions[t].name + " has been deleted");
					house.transactions.splice(t, 1);
				}
			}
			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'transaction removed'})
			})
		})
	})

//============================
// USERS
//============================

//create a new user
router.route('/house/:house_id/user/new')
	.post(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			var user = new User();
			user.name = req.body.name
			house.users.push(user);

			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'new user '+user.name+' created'})
			})
		})
	})

//Delete a user
router.route('/house/:house_id/user/:user_id')
	.delete(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			for(var i = 0; i < house.users.length; i++){
				if(req.params.user_id == house.users[i]._id){
					console.log(house.users[i].name + " has been deleted");
					house.users.splice(i, 1);
				}
			}
			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'user removed'})
			})
		})
	})


//get transactions for specific user
router.route('/house/:house_id/user/:user_id/transactions')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			var userTransactions = [];

			for(t in house.transactions){
				if(req.params.user_id === house.transactions[t].payerId){
					userTransactions.push(house.transactions[t])
				}
			}
			res.json(userTransactions);
		})
	})



//============================
// Global
//============================

// return some response at root
router.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to our api!' });
});


//export to server
module.exports = router;