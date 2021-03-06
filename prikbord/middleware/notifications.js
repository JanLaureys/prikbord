var express = require('express');
var moment = require('moment');
moment.locale('nl');

exports.create = function(req, notification, next){

  var collection = req.db.get('notifications');

  collection.insert(notification, function(err, doc){
    next();
  });
};

exports.get = function(req, res){

  var collection = req.db.get('notifications');
  var user = req.session.user;

  collection.find({"to": collection.id(user._id)}, {sort: {date: -1}, limit: 5}, function(err, docs){
    res.render('notifications', {
      moment: moment,
      notifications: docs
    });
  });
};

exports.getJSON = function(req, res){

  var collection = req.db.get('notifications');
  var user = req.session.user;

  collection.find({"to": collection.id(user._id), "showOnDesktop": false}, {date: 1},  function(err, docs){
    res.json(docs);
  });
};

exports.shownOnDesktop = function(req, res){
  var collection = req.db.get('notifications');
  var user = req.session.user;

  collection.update({"to": collection.id(user._id)}, {$set: {showOnDesktop: true}}, function(err, docs){
    res.json(docs);
  });
};

exports.clear = function(req, res){
  var collection = req.db.get('notifications');
  var user = req.session.user;

  collection.remove({"to": collection.id(user._id)}, function(e, doc){
    res.render('notifications', {
      moment: moment,
      notifications: []
    });
  });
};