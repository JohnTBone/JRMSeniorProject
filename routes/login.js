var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Questions = require('../models/question');

router.post('/', function(req, res, next) {

 console.log("inside the post method \n"+req.body.commandObject);

  var commandObject = eval('('+req.body.commandObject+')');
  
  console.log("the commandObjectJSON is :"+JSON.stringify(commandObject)+"\n"+ commandObject.command
    +"\n"+commandObject.data);

  console.log(commandObject.data);

  User.find(commandObject.data,function(err, user){

     console.log("inside the find retrieval  \n"+user);

    if(err)
      console.log("error:\t"+err);
    else{

    //console.log(user.userName);

      if(user[0]){
        // Questions.find({userName:user[0].userName}, function(err, Questions){

        //   if(err)
        //     console.log("error:\t"+err);
        //   else
        //     res.send(Questions);

        // });

        var returnObject = {result:1,data:user[0]};  //result 1 means everything is OK
        console.log(returnObject);

        res.send(returnObject);
      }
      else
        res.send({result:0}); //result 0 means can't find user or password
   }
  });
});

router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

 console.log("inside the get method \n\n"+req.query.userName);

  //var un = req.query.userName;
  //var pass = req.query.password;

// > db.questions.aggregate({$project:{_id:0,myNames:"$body"}})


  Questions.aggregate({$project:{_id:0,myNames:"$body"}},function(err, user){

    if(err)
      console.log("error:\t"+err);
    else{

    //console.log(user.userName);

      if(user[0]){
        // Questions.find({userName:user[0].userName}, function(err, Questions){

        //   if(err)
        //     console.log("error:\t"+err);
        //   else
        //     res.send(Questions);

        // });

        res.send({result:"successful login",data:user[0]});

      }
      else
        res.send({result:"wrong userName and/or password"});
   }
  });
});

module.exports = router;
