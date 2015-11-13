
// //var loggedIn = require('../middleware/loggedIn');
// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var Question = require('../models/question');
// var ObjectId = mongoose.Schema.Types.ObjectId;

// router.post('/', function (req, res, next) {
// 	console.log('inside /main \ncommandObject is:\t' + req.body.commandObject);

// 	var commandObject = eval('('+req.body.commandObject+')');
// 	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);

// 	var type = commandObject.command;
// 	var subscriber = commandObject.data.userId;
// 	console.log('type is:\t' + type + '\nsubscriber is:\t' + subscriber);

// 	var Subscription;
	
// 	switch(type) {
// 		case "getmyqestions":
// 			console.log('Question list requested');
// 			Subscription = require('../models/myQuestions');
			
// 			break
// 		case "getmyusersquestions":
// 			console.log('User list requested');
// 			var Subscription = require('../models/myUsers');
			
// 			break
// 		case "getmycoursesquestions":
// 			console.log('Course list requested');
// 			Subscription = require('../models/myCourses');
			
// 			break
// 	}

// 		var subList = Subscription.aggregate({$project:{_id:0,subscriber:1,_id:"$target"}}).find({subscriber : subscriber});
// 		subList.exec(function (err, subs){
// 			console.log('inside the question subscription finder...');

// 			//if (!subs) return next(); // 404
// 			if(err) {
// 				console.log("error:\t" + err);
// 				res.send(err);
// 				//return next(err);
// 			}
// 			else if(subs == '') {
// 				var notFound = 'Subscriptions not found';
// 				console.log(notFound);
// 				res.send({ result : 0 });
// 			}
// 			else {
// 				console.log('@@@@@@@@@@@subs:\t' + subs);
// 				var query;
// 				var target = new Array();
				
// 				switch(type) {
// 					case "getQuestionSub":
// 						subs.forEach(function(entry){
// 							target.push('{ _id : ' + entry.target + ' }');
// 						});
// 						console.log('target:\t' + target);
// 						break
// 					case "getUserSub":
// 						subs.forEach(function(entry){
// 							target.push('{ userId : ' + entry.target + ' }');
// 						});
// 						console.log('target:\t' + target);					
// 						break
// 					case "getCourseSub":
// 						subs.forEach(function(entry){
// 							target.push('{ courseId : ' + entry.target + ' }');
// 						});
// 						console.log('target:\t' + target);						
// 						break
// 					default:
// 						query = null;
// 				}

// 				query = Question.findById(target).populate('userId', 'userName');
// 				query.exec(function (err, results) {
// 					console.log('inside the question finder...');
// 						Question.deepPopulate(results, 'courseId.department', function(err, results) {
// 						//if (!results) return next(); // 404
// 						if(err) {
// 							console.log("error:\t" + err);
// 							res.send(err);
// 							//return next(err);
// 						}
// 						else if(results == '') {
// 							var notFound = 'Results not found';
// 							console.log(notFound);
// 							res.send({ result : 0 });
// 						}
// 						else {
// 							console.log('The returned results is:\t' + results);
// 							res.send({ result : 1, data : results }); //1 means returned questions and responses
// 						}
// 					});
// 				});
// 			}
// 		});
// });

// /*
// router.post('/myQuestions', function (req, res, next) {
// 	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
// 	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
	
	
	
// 	res.send('myQuestions response');
// });

// router.post('/myUsers', function (req, res, next) {
// 	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
// 	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
// 	res.send('myUsers response');
// });


// router.post('/myCourses', function (req, res, next) {
// 	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
// 	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
// 	res.send('myCourses response');
// });
// */

// module.exports = router;





//var loggedIn = require('../middleware/loggedIn');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Model = require('../models/question');
var Course = require('../models/course');
var Questions = require('../models/question');


router.post('/', function (req, res, next) {
	console.log('inside /main \ncommandObject is:\t' + req.body.commandObject);

	var commandObject = eval('('+req.body.commandObject+')');
	console.log('the commandObject JSON is:\t' + JSON.stringify(commandObject) + '\ncommandObject.command:\t' + commandObject.command + '\ncommandObject.data:\t' + commandObject.data);

	var type = commandObject.command;
	var subscriber = commandObject.data.userId;
	console.log('type is:\t' + type + '\nsubscriber is:\t' + subscriber);

	switch(type) {
		case "getmyqestions":
			console.log('Question list requested');
			var Subscription = require('../models/myQuestions');
			
			var questionList = Subscription.find({subscriber : subscriber});
			questionList.exec(function (err, questions){
				console.log('inside the question subscription finder...');
		
				//if (!questions) return next(); // 404
				if(err) {
					console.log("error:\t" + err);
					res.send(err);
					//return next(err);
				}
				else if(questions == '') {
					var notFound = 'Questions not found';
					console.log(notFound);
					res.send({ result : 0 });
				}
				else {
					console.log('questions:\t' + questions + '\nquestions.target:\t' + questions[0].target);
					var query = Model.find({ _id : questions[0].target }).populate('userId', 'userName -_id');
					query.exec(function (err, results) {
						console.log('inside the question finder...');

						Model.deepPopulate(results, 'courseId.department', function(err, results) {
							//if (!ersults) return next(); // 404
							if(err) {
								console.log("error:\t" + err);
								res.send(err);
								//return next(err);
							}
							else if(results == '') {
								var notFound = 'Results not found';
								console.log(notFound);
								res.send({ result : 0 });
							}
							else {
								console.log('The returned results is:\t' + results);
								res.send({ result : 1, data : results }); //1 means returned questions and responses
							}
						});
					});
				}
			});
			break;
		case "getmyusersquestions":
			var Subscription = require('../models/myUsers');
			
			var userList = Subscription.find({subscriber : subscriber});
			userList.exec(function (err, users){
				console.log('inside the user subscription finder...');
		
				//if (!users) return next(); // 404
				if(err) {
					console.log("error:\t" + err);
					res.send(err);
					//return next(err);
				}
				else if(users == '') {
					var notFound = 'Users not found';
					console.log(notFound);
					res.send({ result : 0 });
				}
				else {
					console.log('User list requested');
					console.log('users:\t' + users + '\nusers.target:\t' + users[0].target);
					var query = Model.find({ userId : users[0].target }).populate('userId', 'userName -_id');
					query.exec(function (err, results) {
						console.log('inside the question finder...');

						Model.deepPopulate(results, 'courseId.department', function(err, results) {
							//if (!results) return next(); // 404
							if(err) {
								console.log("error:\t" + err);
								res.send(err);
								//return next(err);
							}
							else if(results == '') {
								var notFound = 'Results not found';
								console.log(notFound);
								res.send({ result : 0 });
							}
							else {
								console.log('The returned results is:\t' + results);
								res.send({ result : 1, data : results }); //1 means returned questions and responses
							}
						});
					});
				}
			});
			break;
		case "getmycoursesquestions":
			Subscription = require('../models/myCourses');
		
			var courseList = Subscription.find({subscriber : subscriber});
			courseList.exec(function (err, courses){
				console.log('inside the course subscription finder...');
		
				//if (!courses) return next(); // 404
				if(err) {
					console.log("error:\t" + err);
					res.send(err);
					//return next(err);
				}
				else if(courses == '') {
					var notFound = 'Courses not found';
					console.log(notFound);
					res.send({ result : 0 });
				}
				else {
					console.log('Course list requested');
					console.log('courses:\t' + courses + '\ncourses.target:\t' + courses[0].target);
					var query = Model.find({ courseId : courses[0].target }).populate('userId', 'userName -_id');
					query.exec(function (err, results) {
						console.log('inside the question finder...');
		
						Model.deepPopulate(results, 'courseId.department', function(err, results) {
							//if (!results) return next(); // 404
							if(err) {
								console.log("error:\t" + err);
								res.send(err);
								//return next(err);
							}
							else if(results == '') {
								var notFound = 'Results not found';
								console.log(notFound);
								res.send({ result : 0 });
							}
							else {
								console.log('The returned results is:\t' + results);
								res.send({ result : 1, data : results }); //1 means returned questions and responses
							}
						});
					});
				}
			});
			break;
		default:
			res.send('nothing here...');
	}
});


router.post('/myQuestions', function(req, res, next) {

 console.log("inside the post method \n"+req.body.commandObject);

  var commandObject = eval('('+req.body.commandObject+')');
  
  console.log("the commandObjectJSON is :"+JSON.stringify(commandObject)+"\n"+ commandObject.command
    +"\n"+commandObject.data);

  console.log(commandObject.data);

  Questions.find(commandObject.data,function(err, myQuestions){

     console.log("inside the find retrieval  \n"+myQuestions);

    if(err)
      console.log("error:\t"+err);
    else{

    //console.log(user.userName);

      if(myQuestions[0]){
        // Questions.find({userName:user[0].userName}, function(err, Questions){

        //   if(err)
        //     console.log("error:\t"+err);
        //   else
        //     res.send(Questions);

        // });

  		myQuestions[0].createdAt= new Date(myQuestions[0].createdAt.toString());

        var returnObject = {result:1,data:myQuestions};  //result 1 means everything is OK
        console.log(returnObject);

        res.send(returnObject);
      }
      else
        res.send({result:0}); //result 0 users has no questions
   }
  });
});


router.get('/orstatement', function(req, res, next) {

 // console.log("inside the post method \n"+req.body.commandObject);

 //  var commandObject = eval('('+req.body.commandObject+')');
  
 //  console.log("the commandObjectJSON is :"+JSON.stringify(commandObject)+"\n"+ commandObject.command
 //    +"\n"+commandObject.data);

 //  console.log(commandObject.data);

  Questions.find({$or:[{_id:"55b931d836754a5733d21406"},{_id:"55b9355549651be23b694561"}]},function(err, myQuestions){

     console.log("inside the find retrieval  \n"+myQuestions);

    if(err)
      console.log("error:\t"+err);
    else{

    //console.log(user.userName);

      if(myQuestions[0]){
        // Questions.find({userName:user[0].userName}, function(err, Questions){

        //   if(err)
        //     console.log("error:\t"+err);
        //   else
        //     res.send(Questions);

        // });

  		myQuestions[0].createdAt= new Date(myQuestions[0].createdAt.toString());

        var returnObject = {result:1,data:myQuestions};  //result 1 means everything is OK
        console.log(returnObject);

        res.send(returnObject);
      }
      else
        res.send({result:0}); //result 0 users has no questions
   }
  });
});
/*


router.post('/myQuestions', function (req, res, next) {
	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
	
	
	
	res.send('myQuestions response');
});

router.post('/myUsers', function (req, res, next) {
	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
	res.send('myUsers response');
});


router.post('/myCourses', function (req, res, next) {
	//if a timestamp is sent with the request, grab the next 10 questions older than (time is less than) the timestamp
	
	
	
	//if no timestamp is sent, just grab the 10 most recent from the subscription
	
	res.send('myCourses response');
});
*/

module.exports = router;