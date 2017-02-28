var mongoose = require('mongoose');

var users = mongoose.model('Users', {
	name : String,
	email: String
});

module.exports = users;