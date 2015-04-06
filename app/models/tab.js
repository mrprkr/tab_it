var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email: String
})

var TransactionSchema = new Schema({
    desc: String,
    amount: Number,
    split: Number,
    created_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

var TabSchema = new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    member: { type: Schema.Types.ObjectId, ref: 'User' },
    created: {type: Date, default: Date.now},
    transactions: [TransactionSchema]
});

module.exports = mongoose.model('Tab', TabSchema);
module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Transaction', TransactionSchema);