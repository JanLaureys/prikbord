var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET home page. */
exports.index = function(req, res) {
  // Load messages from database

  var collection = req.db.get('messages');

  var user = req.session.user;

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
      "moment": moment,
      "user": user
    });
  });
}

exports.identityForm = function(req, res){
  var collection = req.db.get('users');

  collection.find({}, function(e, docs){
    res.render('login', {
      users: docs,
      title: "Login",
      moment: moment
    });
  });
}

exports.identity = function(req,res){
  var collection = req.db.get('users');

  collection.findOne({'_id': req.params.uid}, {}, function(e, doc){
    req.session.user = doc;
    res.redirect('/');
  });
};

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/');
};

exports.auth = function(req, res){
  res.render('auth', {});
};

exports.validate = function(req, res){
  var collection = req.db.get('settings');

  if(req.body.auth){
    collection.findOne({'key': 'password'}, function(e, doc){
      if(doc.value == req.body.auth){
        req.session.auth = true;
        res.redirect('/login');
      } else {
        res.render('auth', {error: "Deze code was onjuist"});
      }
    });
  }
};

exports.adminLogin = function(req, res){
  var collection = req.db.get('settings');

  if(req.body.admin){
    collection.findOne({'key': 'admin'}, function(e, doc){
      if(doc.value == req.body.admin){
        req.session.admin = true;
        res.redirect('/admin');
      } else {
        res.redirect('/login');
      }
    });
  }
}
