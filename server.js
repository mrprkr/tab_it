// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
var port = process.env.PORT || 8080;

// INIT API
var api = require('./app/routes/api')
app.use('/api', api)


app.get('/', function(req, res){
	res.json({'message':'index loaded here'})
	// res.sendFile('index.html')
})

console.log("app listening on port: "+ port);
app.listen(port);