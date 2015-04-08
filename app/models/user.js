var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email: String,
	password: String, //this is hashed
	token: String,
	privilege: {type: String, default: "member"},
	//helpers to reset password securely
	failedLoginAttempts: {type: Number, default: 0},
	locked: {type: Boolean, default: false},
	resetToken: String
})

module.exports = mongoose.model('User', UserSchema);