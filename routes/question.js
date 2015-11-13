//var loggedIn = require('../middleware/loggedIn');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Question = require('../models/question');
var Response = require('../models/response');
var Course = require('../models/course');
var Subscribe = require('../models/myQuestions');


//**********
//fetch a question and all (if any) of its responses
//**********
router.post('/getResponses', function (req, res, next) {
	console.log('inside /getResponses \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);
  
	var questionId = commandObject.data.questionId
	console.log('questionId is:\t' + questionId);

	//TO DO: compare updatedAt date to field in database, re-fetch question if different
	
	questionQuery = Question.findById(questionId).populate('userId courseId', 'userName courseName department.shortName courseNumber');
	questionQuery.exec(function (err, question) {
		console.log('inside the question finder...');
		
		//if (!question) return next(); // 404
		if(err) {
			console.log("error:\t" + err);
			//if (err) return next(err);
		}
		else if(!question) {
			var notFound = 'Question not found';
			console.log(notFound);
			res.send({ result : 0 });
		}
		else {
			console.log('The returned question is:\t' + question);
			
			//old response fetch left here for reference
			//var promise = Question.findComments(questionId).exec();
			//                      .sort('created')
			//                      .select('-_id') // exclude the _id
			//                      .exec();
		
			responsesQuery = Response.find({ questionId: questionId }).populate('userId', 'userName');
			responsesQuery.exec(function (err, response) {
				console.log('inside the response finder...');
					//if (!response) return next(); // 404
					if(err){
						console.log("error:\t" + err);
						//if (err) return next(err);
					}
					else if(response == '') {
						var notFound = 'No responses';
						console.log(notFound);
						res.send({ result : 2, data : { question : question, responses : notFound }}); //2 means only question is returned
					}
					else{
						console.log('The returned response(s) is/are:\t' + response);
						// res.send({ result : 1, data : { question : question, responses : response }}); //1 means returned questions and responses
						res.send({ result : 1, data : response }); //1 means returned questions and responses

					}
			});
		}
	});
});


//**********
//create
//**********
//  router.post('/create', loggedIn, function (req, res, next) {
router.post('/create', function(req, res, next){
	console.log('inside /create \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);	

	var title = commandObject.data.title;
	var body = commandObject.data.body;
	var userId = commandObject.data.userId;
	var courseId = commandObject.data.courseId;
	//var userId = req.session.userId;

	console.log('Title:\t' + title + '\nBody:\t' + body + '\nUserId:\t' + userId + '\nCourseId:\t' + courseId);
	
	Question.create({
		title: title
	  , body: body
	  , userId: userId
	  , courseId: courseId
	}, function (err, question) {
		console.log('inside the Question.create...');
		if(err) {
			console.log("error:\t" + err);
		//if (err) return next(err);
		}
		else{
			Subscribe.create({
			  subscriber: question.userId
			  , target: question._id
			}, (function (err) {
				if (err) {
					console.error('had trouble subscribing', err.stack);
				}
				else
					console.log('Subscribed to new question!');
			}));
			
			console.log(question);
			res.send({ result : 1, data : question }); //1 means success for creating question; 2 for success reponses
			//res.redirect('/question/getResponse');
		}
	});
});

//**********
//update
//**********



//**********
//delete
//**********
//router.get("/remove/:questionId", loggedIn, function (req, res, next) {
router.post('/remove', function (req, res, next) {
	console.log('inside /remove \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);
  
	var questionId = commandObject.data.questionId
	console.log('questionId is:\t' + questionId);

	//TO DO: also remove all responses
	
	questionQuery = Question.findById(questionId).remove();
	questionQuery.exec(function (err, question) {
		console.log('inside the question finder...');

		if(err) {
			console.log("error:\t" + err);
			//if (err) return next(err);
		}
		else if(question == ""){
			var notFound = 'Question not found';
			console.log(notFound);
			res.send({ result : 0 });
		}
		else {
			var removed = 'Removed questionId ' + questionId + ' ';
					
			responsesQuery = Response.find({ questionId: questionId }).remove();
			responsesQuery.exec(function (err, response) {
				console.log('inside the response finder...');
				//if (!response) return next(); // 404
				if(err){
					console.log("error:\t" + err);
					//if (err) return next(err);
				}
				else if(response == '') {
					var notFound = 'No responses';
					console.log(removed + notFound);
					res.send({ result : 2, data : { question : removed, responses : notFound }}); //2 means only question is returned
				}
				else{
					removed += 'and all responses';
					console.log(removed);
					res.send({ result : 1, data : removed }); //1 means successful
					//res.redirect('/');
				}
			});
		}
	});
});


//**********
//create responses
//**********
//router.post('/respond/:questionId', loggedIn, function (req, res, next) {
router.post('/respond', function (req, res, next) {
	console.log('inside /respond \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);

	var body = commandObject.data.body
	var questionId = commandObject.data.questionId
	var userId = commandObject.data.userId

	console.log('Body:\t' + body + '\nQuestionId:\t' + questionId + '\nUserId:\t' + userId);

	Response.create({
		body: body
	  , questionId: questionId
	  , userId: userId
	}, function (err, response) {
		console.log('inside the Response.create...');
		if(err) {
			console.log("error:\t" + err);
			//if (err) return next(err);
		}
		else{
			console.log(response);
			res.send({ result : 2, data : { question: questionId, response : response }}); //2 means success for responding
			//res.redirect('/question/getResponse');
		}
	}); 
}); 

module.exports = router;