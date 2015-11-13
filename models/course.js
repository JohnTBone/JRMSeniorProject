var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var courseSchema = new Schema({
	courseName: String
  , department: { type: ObjectId, ref: 'Department' }
  , courseNumber: String
});

//disable automatic indexing in production
//courseSchema.set('autoIndex', false);

//disable "__v" field
courseSchema.set('versionKey', false);

// add created and updated date properties
courseSchema.plugin(timestamps);
courseSchema.plugin(deepPopulate);

module.exports = mongoose.model('Course', courseSchema, 'courses');