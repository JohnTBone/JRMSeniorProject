var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var followUserSchema = new Schema({
	subscriber: { type: ObjectId, index: true }
  , target: { type: ObjectId, index: true }
});

//disable automatic indexing in production
//followUserSchema.set('autoIndex', false);

followUserSchema.index({ subscriber: 1, target: 1 });

//disable "__v" field
followUserSchema.set('versionKey', false);

// add created and updated date properties
followUserSchema.plugin(timestamps);
followUserSchema.plugin(deepPopulate);

module.exports = mongoose.model('FollowUser', followUserSchema, 'userSubs');