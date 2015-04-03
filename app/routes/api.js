/*API ROUTES*/

var mongooseConfig = require('../.././config/api_config.js')
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//connect to mongoose
//configure endpoint in ./config.api_config.js
mongoose.connect(mongooseConfig);

//use bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define router and models
var router = express.Router();
var House = require('../models/house.js');

//middleware here
router.use(function(req, res, next){
	console.log("api request being made");
	next();
})


//============================
// Houses
//============================

//Create a new house
router.route('/house/new')
	.post(function(req, res){
		var house = new House();
		// console.log(req.body.name);
		house.name = req.body.name;

		if(house.name){
			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'new house created', 'house_id': house._id})
			})
		}
	});

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
		House.remove({
      _id: req.params.house_id
        }, function(err, house) {
    	if (err)
        res.send(err);
    res.json({ message: 'Successfully deleted' });
     });
	});

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

			var transaction = {};
			transaction.name = req.body.name;
			transaction.amount = req.body.amount;
			transaction.userId = req.body.userId;
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
			var transaction = house.transactions.id(req.params.transaction_id)
			res.json(transaction)
		})
	})

	//delete a specific transaction
	.delete(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			house.transactions.id(req.params.transaction_id).remove();			
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
			var user = {};
			user.name = req.body.name
			house.users.push(user);

			house.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'new user '+user.name+' created'})
			})
		})
	})

//get all users
router.route('/house/:house_id/users')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			res.json(house.users)
		})
	})


//get a specific user
router.route('/house/:house_id/user/:user_id')
	.get(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			res.json(house.users.id(req.params.user_id))
		})
	})

	//Delete a user
	.delete(function(req, res){
		House.findById(req.params.house_id, function(err, house){
			if(err)
				res.send(err)
			house.users.id(req.params.user_id).remove();
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
				if(req.params.user_id === house.transactions[t].userId){
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
	res.json({ message: 'Welcome to our api!' });
});


//export to server
module.exports = router;

