var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var followCourseSchema = new Schema({
	subscriber: { type: ObjectId, index: true }
  , target: { type: ObjectId, index: true }
});

//disable automatic indexing in production
//followCourseSchema.set('autoIndex', false);

followCourseSchema.index({ subscriber: 1, target: 1 });

//disable "__v" field
followCourseSchema.set('versionKey', false);

// add created and updated date properties
followCourseSchema.plugin(timestamps);
followCourseSchema.plugin(deepPopulate);

module.exports = mongoose.model('FollowCourse', followCourseSchema, 'courseSubs');