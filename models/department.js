var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var departmentSchema = new Schema({
	longName: String
  , shortName: String
});

//disable automatic indexing in production
//departmentSchema.set('autoIndex', false);

//disable "__v" field
departmentSchema.set('versionKey', false);

// add created and updated date properties
departmentSchema.plugin(timestamps);
departmentSchema.plugin(deepPopulate);

module.exports = mongoose.model('Department', departmentSchema, 'departments');