var express = require('express');
var router = express.Router();

var moment = require('moment');

/* GET home page. */
router.get('/:query', function (req, res) {
  // Load messages from database
  var db = req.db;
  var collection = db.get('messages');

  var query = req.params.query;

  collection.find({$text: { $search: query, $language: "nl"}}, {sort: {date: -1}}, function (e, docs) {
    res.render('search', {
      "messages" : docs,
      "title": "Gebruikers",
      "moment": moment,
      "search_query": query
    });
  });
});

router.get('/', function(req, res){
  // Load messages from database
  var db = req.db;
  var collection = db.get('messages');

  collection.find({}, {sort: {date: -1}}, function (e, docs) {
    res.render('search', {
      "messages" : docs,
      "title": "Alle berichten",
      "moment": moment
    });
  });
});

router.post('/submit', function(req, res){


  var search_query = req.body.search_query;

  res.redirect('/search/' + search_query);


});

module.exports = router;
