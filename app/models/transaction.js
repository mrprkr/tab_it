var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransactionSchema   = new Schema({
    name: String,
    amount: String,
    payerId: String,
    split: String
});

module.exports = mongoose.model('Transaction', TransactionSchema);