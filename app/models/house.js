var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var User = new Schema({
    name: String
});

var Transaction   = new Schema({
    name: String,
    amount: String,
    userId: String,
    split: String
});

var House = new Schema({
    name: String,
    users: [User],
    created: {type: Date, default: Date.now},
    transactions: [Transaction]
});

module.exports = mongoose.model('House', House);