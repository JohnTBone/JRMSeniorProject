//var loggedIn = require('../middleware/loggedIn');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Department = require('../models/department');
var Course = require('../models/course');


//register a new user
router.post('/register', function (req, res, next) {
	console.log('inside /register \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);

	var userName = commandObject.data.userName;
	var firstName = commandObject.data.firstName;
	var lastName = commandObject.data.lastName;
	var email = commandObject.data.email;
	var password = commandObject.data.password;
	console.log('userName is:\t' + userName + '\nfirstName is:\t' + firstName + '\nlastName is:\t' + lastName+ '\nemail is:\t' + email + '\npassword is:\t' + password);
	
	User.create({
		userName: userName
	  , firstName: firstName
	  , lastName: lastName
	  , email: email
	  , password: password
	}, function (err, newUser) {
		console.log('submitting new user...');
		if(err) {
			console.log("error:\t" + err);
			//if (err) return next(err);
		}
		else{
			console.log(newUser);
			res.send({ result : 1, data : newUser }); //1 means success
		}
	});	
})


//subscribe to a question, user, or course
router.post('/subscribe', function (req, res, next) {
	console.log('inside /subscribe \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);

	var type = commandObject.command;
	var subscriber = commandObject.data.subscriber;
	var target = commandObject.data.target;
	console.log('type is:\t' + type + '\nsubscriber is:\t' + subscriber + '\ntarget is:\t' + target);
	
	//TO DO: ensure unique subscriptions
	var Submission;
	
	switch(type) {
		case "subscribetoquestion":
			Submission = require('../models/myQuestions');
			console.log('Question detected');
			break;
		case "subscribetouser":
			Submission = require('../models/myUsers');
			console.log('User detected');
			break;
		case "subscribetocourse":
			Submission = require('../models/myCourses');
			console.log('Course detected');
			break;
		//default:
	}
	
	Submission.create({
		subscriber : subscriber
	  , target : target
	}, function (err, subscription) {
		console.log('submitting subscription...');
		if(err) {
			console.log("error:\t" + err);
			//if (err) return next(err);
		}
		else{
			console.log(subscription);
			res.send({ result : 1, data : subscription }); //1 means success
		}
	});
});


//view list of courses belonging to a department
router.post('/getCourses', function (req, res, next) {
	console.log('inside /getCourses \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);
  
	var deptId = commandObject.data.deptId;
	console.log('deptId is:\t' + deptId);

	coursesQuery = Course.find({ department: deptId }).populate('department', 'longName shortName');
	coursesQuery.exec(function (err, courses) {
		console.log('inside the course finder...');
			//if (!courses) return next(); // 404
			if(err){
				console.log("error:\t" + err);
				//if (err) return next(err);
			}
			else if(courses == '') {
				var notFound = 'No courses';
				console.log(notFound);
				res.send({ result : 0 });
			}
			else{
				console.log('The returned course(s) is/are:\t' + courses);
				res.send({ result : 1, data : courses }); //1 means returned department and courses
			}
	});
});


module.exports = router;