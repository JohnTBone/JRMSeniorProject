var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.Types.ObjectId;
var deepPopulate = require('mongoose-deep-populate');

var Schema = mongoose.Schema;

var followQuestionSchema = new Schema({
	subscriber: { type: ObjectId, index: true }
  , target: { type: ObjectId, index: true, ref: 'Question' }
});

//disable automatic indexing in production
//followQuestionSchema.set('autoIndex', false);

followQuestionSchema.index({ subscriber: 1, target: 1 });

//disable "__v" field
followQuestionSchema.set('versionKey', false);

// add created and updated date properties
followQuestionSchema.plugin(timestamps);
followQuestionSchema.plugin(deepPopulate);

module.exports = mongoose.model('FollowQuestion', followQuestionSchema, 'questionSubs');