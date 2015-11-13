var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var timestamps = require('mongoose-timestamp');
var deepPopulate = require('mongoose-deep-populate');

var responseSchema = mongoose.Schema({
    body: { type: String, trim: true, validate: validateText }
  , questionId: { type: ObjectId, index: true }
  , userId: { type: ObjectId, ref: 'User' }
})

function validateText (str) {
  return str.length < 250;
}

//disable automatic indexing in production
//responseSchema.set('autoIndex', false);

//disable "__v" field
responseSchema.set('versionKey', false);

// add created and updated date properties
responseSchema.plugin(timestamps);
responseSchema.plugin(deepPopulate);

module.exports = mongoose.model('Response', responseSchema, 'responses');