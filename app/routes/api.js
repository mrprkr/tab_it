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
var House = require('../models/house.js');
var Tab = require('../models/tab.js');
var User = require('../models/user.js');

//middleware here
router.use(function(req, res, next){
	console.log(req.method+" request being made");
	next();
})


// create a new user
router.route('/users/new')
	.post(function(req, res){
		var user = new User();
		user.name = req.body.name;
		user.password = req.body.password;
		user.email = req.body.email;
		if(user.name && user.password && user.email)
			user.save(function(err){
				if(err)
					res.send(err)
				res.json({message:"created new user", id: user._id})
			})
	})

//get a list of users
router.route('/users')
	.get(function(req, res){
		User.find(function(err, users){
			if(err)
				res.send(err)
			res.json(users)
		})
	})

// Single user endpoint
router.route('/user/:user_id')
	//get a specific user
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err)
				res.send(err)
			res.json(user)
		})
	})

	//delete a specific user
	.delete(function(req, res){
			User.findById(req.params.user_id, function(err, user){
				//make a record of the deleted user
				jf.writeFile('./data/deleted/user_'+user._id+'.json', user, function(err){
					if(err)
						console.log(err)
				User.remove({
							_id: req.params.user_id
						}, function(err){
							if(err)
								res.send(err)
						res.json({message:"Deleted User Successfully"})
				})
			})
		})
	})

//clean up user
router.route('/clean')
	.post(function(req, res){
		User.findById(req.body.user_id, function(err, user){
			user.tabs = [];
			console.log("cleaning: "+req.params.user_id);

			Tab.find(req.params.user_id, function(err, userTabs){
				for(tab in userTabs){
					user.tabs.push(userTabs[tab]._id)
				}
				user.save(function(err){
					if(err)
						res.send(err)
					res.json({message:"user cleaned"})
				})
			})
		})
	})


/* =======================================
		TABS
=======================================
*/


// create a new tab
router.route('/tabs/new')
	.post(function(req, res){
		var tab = new Tab()

		//assign it a name
		tab.name = req.body.name;
		console.log('created new tab with name: '+tab.name);

		User.findById(req.body.user_id, function(err, user){
			if(err)
				res.send(err)

			//set the user as creator
			tab.creator = user._id;

			//add the user to tab users
			tab.users.push(user._id);

			//add the new tab to users list
			user.tabs.push(tab._id);
			user.save(function(err){
				if(err)
					res.send(err)
			})

			//validate the fields are set
			if(tab.name && tab.creator)
				tab.save(function(err){
					if(err)
						res.send(err)
					res.json({message:"created new tab", id: tab._id})
				})
		})
	})

//Get all tabs
router.route('/tabs')
	.get(function(req, res){
		Tab.find(function(err, houses){
			if(err)
				res.send(err)
			res.json(houses)
		})
	})


//specific tab endpoint
router.route('/tab/:tab_id')
	//get a specific tab
	.get(function(req, res){
		Tab.findById(req.params.tab_id, function(err, tab){
			if(err)
				res.send(err)
			res.json(tab)
		})
	})

	//delete a specific tab
	.delete(function(req, res){
		Tab.findById(req.params.tab_id, function(err, tab){
			//keep a record of deleted entries
			jf.writeFile('./data/deleted/tab_'+tab._id+'.json', tab, function(err){
				if(err)
					console.log(err)
				Tab.remove({
							_id: req.params.tab_id
						}, function(err){
							if(err)
								res.send(err)
						res.json({message:"Deleted Tab Successfully"})
				})
			})
		})
	})

//add a new user to a specific tab
router.route('/tab/:tab_id/users/add')
	.post(function(req, res){
	Tab.findById(req.params.tab_id, function(err, tab){
		if(err)
			res.send(err)
		tab.users.push(req.body.user_id)
		tab.save(function(err){
			if(err)
				console.log(err)
			})
		})
	// User.findById(req.body.user_id, function(err, user){
	// 	if(err)
	// 		res.send(err)
	// 	user.tabs.push(req.params.tab_id)
	// 	user.save(function(err){
	// 		if(err)
	// 			console.log(err)
	// 	})
	// 	})
	res.json({message:"added user to tab"})
	})


//add a new transaction
router.route('tab/:tab_id/transactions/add')
	.post(function(req, res){

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

