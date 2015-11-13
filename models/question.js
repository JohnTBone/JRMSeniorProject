var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var timestamps = require('mongoose-timestamp');
var deepPopulate = require('mongoose-deep-populate');

// define the schema
var questionSchema = mongoose.Schema({
    title: { type: String, trim: true }
  , body: String
  , userId: { type: ObjectId, ref: 'User' }
  , courseId: { type: ObjectId, ref: 'Course' }
})

// create a query for responses with a question _id matching 'id'
//questionSchema.statics.findComments = function (id, callback) {
//  return this.model('Response').find({ questionId: id }, callback);
//}

/*
questionSchema.statics.edit = function (req, callback) {
  ObjectId = req.params.id;
  var user = req.session.user;

  // validate current user is the author
  var query = { _id: ObjectId, user: user };

  var update = {};
  update.title = req.params.title;
  update.body = req.params.body;

  this.update(query, update, function (err, numAffected) {
    if (err) return callback(err);

    if (0 === numAffected) {
      return callback(new Error('nothing to modify'));
    }

    callback();
  })
}*/

//disable automatic indexing in production
//questionSchema.set('autoIndex', false);

//disable "__v" field
questionSchema.set('versionKey', false);

// add created and updated date properties
questionSchema.plugin(timestamps);
questionSchema.plugin(deepPopulate);

// ***************************
// *****lifecycle events******
// ***************************
// https://www.npmjs.com/package/mongoose-lifecycle
var lifecycle = require('mongoose-lifecycle');
questionSchema.plugin(lifecycle);

// compile the model
var Post = mongoose.model('Question', questionSchema, 'questions');

// handle events
Post.on('afterInsert', function (question) {
	// lifecycle callout
	var url = "http://localhost:3000/question/";
	console.log('New question posted! %s%s', url, question.id);
})

Post.on('afterRemove', function (question) {
  this.model('Response').remove({ question: question._id }).exec(function (err) {
    if (err) {
      console.error('had trouble cleaning up old responses', err.stack);
    }
  })
})

module.exports = Post;