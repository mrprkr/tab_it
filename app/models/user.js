var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    passwordHash: String,
    passwordSalt: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);