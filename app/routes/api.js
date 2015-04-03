var mongooseConfig = require('../.././config/api_config.js')
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//start Mongoose
mongoose.connect(mongooseConfig);

//use a bodyparser for JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define router and models
var router = express.Router();
var Transaction = require('../models/transaction.js');
var House = require('../models/house.js');


//middleware here
router.use(function(req, res, next){
	console.log("api request being made");
	next();
})

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

router.route('/houses')
	.get(function(req, res){
		if(req.header.host === 'localhost:8080'){
			House.find(function(err, houses){
				if(err)
					res.send(err)
				res.json(houses)
			})
		}
		else {
			console.log("unauth lookup request")
			res.json({'message':'not authorised to lookup'})			
		}
	})




router.route('/transactions')
	// New transaction
	.post(function(req, res){
		var transaction = new Transaction();
		transaction.name = req.body.name;

		if(transaction.name){
			transaction.save(function(err){
				if(err)
					res.send(err)
				res.json({'message':'new transaction added'})
			})
		}
		else{
			res.json({'message':'error: fields do not match schema'})
		}
	})

	// get all transactions
	.get(function(req, res){
		Transaction.find(function(err, transactions){
			if(err)
				res.send(err)
			res.json(transactions)
		});
	});

router.route('/transaction/:transaction_id')
	.get(function(req, res){
		Transaction.findById(req.params.transaction_id, function(err, transaction){
			if(err)
				res.send(err)
			res.json(transaction)
		});
	})

	.delete(function(req, res){
		Transaction.remove({
			_id: req.params.transaction_id
		}, function(err, transaction){
			if(err)
				res.send(err)
			res.json({'message':'deleted transaction'})
		})
	})


// return some response at root
router.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to our api!' });
});


module.exports = router;

