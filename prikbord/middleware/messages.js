var express = require('express');
var router = express.Router();

var moment = require('moment');
var notifications = require('./notifications');

/*
 * /messages/new: Page where you can post new messages. Totally crazy and pimping aah yeah
 */
exports.new = {
  form: function(req, res){

    var db = req.db;
    var collection = db.get('users');

    collection.find({}, function(e, docs){
      res.render('post', {"title" : "Een nieuw bericht sturen", users: docs});
    });
  },
  post: function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var message = req.body.message;
    var messages = db.get('messages');

    var date = new Date();

    if(req.body.to) {
      var user_to = req.body.to;
      var users = db.get('users');

      users.findById(user_to, function (err, user) {
        if (!err) {
          var fields = {
            from: req.session.user,
            to: user,
            date: date.toJSON(),
            resolved: false,
            message: message
          };
          insertMessage(fields);
        } else {
          console.log(err);
        }
      });
    } else {
      var fields = {
        from: req.session.user,
        date: date.toJSON(),
        resolved: false,
        message: message
      };
      insertMessage(fields);
    }


    function insertMessage(fields){
      // Set our collection
      var messages = db.get('messages');

      // Submit to the DB
      messages.insert(fields, function (err, doc) {
        if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
        }
        else {
          // Create a notification and then go further
          if(doc.to){
            notifications.create(req, {
              type: "fa fa-envelope-o",
              to: doc.to._id,
              message: "Bericht van " + doc.from.username,
              link : "/messages/detail/" + doc._id,
              seen: false,
              date: date.toJSON(),
              showOnDesktop: false
            }, function(){
              // redirect to the homepage
              res.redirect("/");
            });
          } else {
            res.redirect("/");
          }
        }
      });
    }
  }
};

exports.unresolved = {
  view: function(req, res){
    var user = req.session.user;
    var collection = req.db.get('messages');

    // Find all messages sent to the logged in user with a status of unresolved
    collection.find({'to._id': collection.id(user._id), resolved: false},{sort: {date: -1}},function(e,docs){
      res.render('index', {
        "messages" : docs,
        "title": "Onafgehandelde berichten",
        "moment": moment,
        "user": user
      });
    });
  },
  count: function(req, res){
    var user = req.session.user;
    var collection = req.db.get('messages');

    // Find all messages sent to the logged in user with a status of unresolved
    collection.find({'to._id': collection.id(user._id), resolved: false},{sort: {date: -1}},function(e,docs){
      res.json({count: docs.length });
    });

  }
};

exports.resolve = function(req, res){

  var messages = req.db.get('messages');
  var message = req.body.message;

  messages.updateById(message, {$set: {resolved: true}}, function(err, doc){
    if(err){
      // Send an error
      res.json({"error": true});
    } else {
      res.json({"error": false});
    }
  });
};

exports.detail = function(req, res){

  var messages = req.db.get('messages');
  var mid = req.params.mid;

  var user = req.session.user;

  messages.findById(mid, function(e, doc){
    res.render('message', {
      message: doc,
      moment: moment,
      user: user
    });
  });
}

exports.comments = {

  add: function(req, res){

    var messages = req.db.get('messages');
    var mid = req.params.mid;
    var user = req.session.user;
    var date  = new Date();

    messages.updateById(mid, {$push: {comments: {
      user: user,
      comment: req.body.comment,
      date: date.toJSON()
    }}}, function(err, doc){
      res.json(doc);
    });
  }
};