var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	userName: String
  , firstName: String
  , lastName: String
  , email: String
  , password: String
});

//disable automatic indexing in production
//userSchema.set('autoIndex', false);

//disable "__v" field
userSchema.set('versionKey', false);

// add created and updated date properties
userSchema.plugin(timestamps);
userSchema.plugin(deepPopulate);

module.exports = mongoose.model('User', userSchema, 'users');