var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var HouseSchema = new Schema({
    name: String,
    users: Array,
    transactions: Array
});

module.exports = mongoose.model('House', HouseSchema);