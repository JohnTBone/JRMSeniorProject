var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Department = require('../models/department');
var Course = require('../models/course');

router.post('/department/create', function(req, res, next){
	console.log('inside /department/create \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);	

	var longName = commandObject.data.longName;
	var shortName = commandObject.data.shortName;

	console.log('Long Name:\t' + longName + '\nShort Name:\t' + shortName);
	
	Department.create({
		longName: longName
	  , shortName: shortName
	}, function (err, newDept) {
		console.log('creating the department...');
		if(err) {
			console.log("error:\t" + err);
		//if (err) return next(err);
		}
		else{
			console.log(newDept);
			res.send({ result : 1, data : newDept }); //1 means success
		}
	});
});


router.post('/course/create', function(req, res, next){
	console.log('inside /course/create \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);	

	var courseName = commandObject.data.courseName;
	var deptId = commandObject.data.deptId;
	var courseNumber = commandObject.data.courseNumber;

	console.log('Course Name:\t' + courseName + '\nDepartment ID:\t' + deptId + '\nCourse Number:\t' + courseNumber);
	
	Course.create({
		courseName: courseName
	  , department: deptId
	  , courseNumber: courseNumber
	}, function (err, newCourse) {
		console.log('creating the course...');
		if(err) {
			console.log("error:\t" + err);
		//if (err) return next(err);
		}
		else{
			console.log(newCourse);
			res.send({ result : 1, data : newCourse }); //1 means success
		}
	});
});

module.exports = router;