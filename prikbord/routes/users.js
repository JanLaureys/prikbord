var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res) {
  // Load messages from database
  var db = req.db;
  var collection = db.get('users');

  collection.find({}, function(e,docs){
    res.render('users', {
      "users" : docs,
      "title": "Gebruikers",
      "moment": moment
    });
  });
});

module.exports = router;
