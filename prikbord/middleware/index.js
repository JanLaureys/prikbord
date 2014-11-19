var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET home page. */
exports.index = function(req, res) {
  // Load messages from database

  var collection = req.db.get('messages');

  var date_start;
  var date_end;

  if(req.cookies.date){
    date_start = moment(req.cookies.date);
    date_start.startOf('d');
    date_end = moment(req.cookies.date);
    date_end.add(1, 'd');
  } else {
    date_start = moment();
    date_start.startOf('d');
    date_end = moment();
    date_end.add(1, 'd');
  }

  collection.find({date: {$gt: date_start.toJSON(), $lt: date_end.toJSON()}},{sort: {date: -1}},function(e,docs){
    res.render('index', {
      "messages" : docs,
      "title": "Prikbord",
      "moment": moment
    });
  });
}

exports.loginForm = function(req, res){
  var collection = req.db.get('users');

  collection.find({}, function(e, docs){
    res.render('login', {
      users: docs,
      title: "Login",
      moment: moment
    });
  });
}

exports.login = function(req,res){
  var collection = req.db.get('users');

  console.log(req.params.uid);

  collection.findOne({'_id': req.params.uid}, {}, function(e, doc){
    req.session.user = doc;
    res.redirect('/');
  });
}
