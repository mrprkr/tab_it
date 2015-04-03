var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Transaction = new Schema({
    name: String,
    amount: Number,
    userId: String,
    split: Number
});

var TabSchema = new Schema({
    name: String,
    users: Array,
    creator: String,
    created: {type: Date, default: Date.now},
    transactions: [Transaction]
});

module.exports = mongoose.model('Tab', TabSchema);