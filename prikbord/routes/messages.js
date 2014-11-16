var express = require('express');
var router = express.Router();

var moment = require('moment');

/*
 * /messages/new: Page where you can post new messages. Totally crazy and pimping aah yeah
 */
router.get('/new', function(req, res){

  var db = req.db;
  var collection = db.get('users');

  collection.find({}, function(e, docs){
    res.render('post', {"title" : "Een nieuwe bericht sturen", users: docs});
  });
});

/*
 * /messages/unresolved
 */

router.get('/unresolved', function(req, res){

  var db = req.db;
  var user = req.session.user;
  var collection = db.get('messages');

  // Find all messages sent to the logged in user with a status of unresolved
  collection.find({'to._id': collection.id(user._id), resolved: false},{sort: {date: -1}},function(e,docs){
    res.render('index', {
      "messages" : docs,
      "title": "Onafgehandelde berichten",
      "moment": moment
    });
  });
});


/*
 * /messages/unresolved/count; RETURNS {count: <count>}
 */

router.get('/unresolved/count', function(req, res){
  var db = req.db;
  var user = req.session.user;
  var collection = db.get('messages');

  // Find all messages sent to the logged in user with a status of unresolved
  collection.find({'to._id': collection.id(user._id), resolved: false},{sort: {date: -1}},function(e,docs){

    res.json({count: docs.length });
  });

});


/* POST to Add Message Service */
router.post('/new', function(req, res) {

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
        }
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
    }
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
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("/");
        // And forward to success page
        res.redirect("/");
      }
    });
  }
});

router.post('/resolve', function(req, res){

  var db = req.db;

  var messages = db.get('messages');
  var message = req.body.message;

  messages.updateById(message, {$set: {resolved: true}}, function(err, doc){
    if(err){
      // Send an error
      res.json({"error": true});
    } else {
      res.json({"error": false});
    }
  });
});


module.exports = router;
