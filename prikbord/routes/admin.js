var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET home page. */
router.get('/users', function (req, res) {
  // Load messages from database
  var db = req.db;
  var collection = db.get('users');

  collection.find({}, {}, function (e, docs) {
    res.render('admin/user', {
      "users": docs,
      "title": "Gebruikers",
      "moment": moment
    });
  });
});

router.get('/users/:uid', function (req, res) {

  var db = req.db;
  var collection = db.get('users');
  var uid = req.params.uid;

  collection.findById(uid, {}, function (e, user) {
    collection.find({}, {}, function (e, users) {
      res.render('admin/user', {
        "users": users,
        "user": user,
        "title": user.username,
        "moment": moment
      });
    });
  });
});

module.exports = router;
