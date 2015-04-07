// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API
var api = require('./app/routes/api');
app.use('/api', api);


// HTML
app.use('/', express.static(__dirname + '/public'));
app.get('/[^\.]+$', function(req, res){
    res.sendFile("index.html", {root: __dirname + '/public' });
});
app.get('/', function(req, res){
	res.sendFile('index.html', {root: __dirname + '/public' })
})

//Start the server
console.log("app listening on port: "+ port);
app.listen(port);