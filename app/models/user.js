var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email: String,
	password: String, //this is hashed
	token: String,
	loginAttempts: {type: Number, default: 0},
	locked: {type: Boolean, default: false}
})

module.exports = mongoose.model('User', UserSchema);