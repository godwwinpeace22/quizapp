/* eslint-disable */
var express = require('express');
var router = express.Router();
const Question = require('../models/question');
const User = require('../models/user');
//const Score = require('../models/score');
//var async = require('async');

//restrict accces to home page
let restrictAccess = function(req,res, next){
	if(req.user){
    next();
	}
	else{
    res.redirect('/users/login');
	}
}
/* GET home page. */
router.get('/', restrictAccess, function(req, res) {
  console.log(req.user.currQuestNo);
  var currTime = new Date().getTime()
  var diff = req.user.timeStamp > 0 ? req.user.timeStamp - currTime : 0
  if(req.user.currQuestNo > 4 || diff < 0){
    res.redirect('/completed')
  }else{
    Question.find({}).skip(req.user.currQuestNo * 1 -1).limit(1).exec((err, question)=>{
      console.log(question);
      if(req.user.currQuestNo == 1 && req.user.timeStamp == 0){ //register timestamp for new users
        User.findOneAndUpdate({_id:req.user._id}, {timeStamp:Date.now() + 2 * 60 * 1000}).exec((err,user)=>{
          console.log(user.timeStamp)
          let date = new Date().getTime()
          res.render('index', {
            title:'Qiuz',
            question:question,
            score:req.user.latestScore,
            currQuestNo:req.user.currQuestNo,
            timeStamp:date + 2 * 60 * 1000, // 2 minutes
            serverTime:date
          });
        })
      }
      else{ // do nothing for old users
        res.render('index', {
          title:'Qiuz',
          question:question,
          score:req.user.latestScore,
          currQuestNo:req.user.currQuestNo,
          timeStamp:req.user.timeStamp,
          serverTime:new Date().getTime()
        });
      }
      
    });
  }
  
});

router.post('/next', restrictAccess, (req,res,next)=>{
  console.log(req.user.currQuestNo);
  User.findOneAndUpdate({_id:req.user._id}, {currQuestNo:req.user.currQuestNo * 1 + 1}, (err,user)=>{
    //console.log(user.currQuestNo);
    if(req.user.currQuestNo == 4){
     //  res.send({redirect:'/'})
     console.log('true')
     res.status(200).send({
      question: null,
      completed:true,
      currQuestNo:req.user.currQuestNo* 1  + 1,
      timeStamp:user.timeStamp,
      serverTime:new Date().getTime()
    });
    }
    else{
      Question.find({}).skip(user.currQuestNo).limit(1).exec((err,question)=>{
        console.log(question[0]);
        res.status(200).send({
          question: question[0],
          currQuestNo:user.currQuestNo* 1  + 1,
          timeStamp:user.timeStamp,
          serverTime:new Date().getTime()
        });
      })
    }
    
  })
  
})

// Test completed
router.get('/completed', restrictAccess, (req,res,next)=>{
  res.render('testcompleted', {
    title:'Test Completed'
  })
})
// update backend from front-end
router.post('/update', (req,res)=>{
  let update = {currQuestNo:req.body.currQuestNo,latestScore:req.body.score,timeStamp:req.body.timeStamp}
  let query = {_id:req.user._id};
  User.update(query,update, function(err,done){
    if(err) throw err;
    
    //console.log(done);
    res.send(done);
  })
});
router.get('/addquestions', (req,res)=>{
  res.render('addquestions', {title:'Add Questions'})
});
router.post('/addquestions', (req,res)=>{
  //res.send('You posted to this route...');
  let question = new Question({
    theQuestion:req.body.theQuestion,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    theAnswer:req.body.theAnswer
  });
  question.save(function(err){
    if(err) throw err;
    //console.log(done + 'question saved...');
     res.redirect('/addquestions');
  });
});

module.exports = router;
