var express = require('express');
var moment = require('moment');

/* GET home page. */
exports.results = function (req, res) {
  // Load messages from database
  var collection = req.db.get('messages');

  var query = req.params.query;
  var user = req.session.user;

  collection.find({$text: { $search: query, $language: "nl"}}, {sort: {date: -1}}, function (e, docs) {
    res.render('search', {
      "messages" : docs,
      "title": "Gebruikers",
      "moment": moment,
      "search_query": query,
      "user": user
    });
  });
}

exports.all = function(req, res){

  // Load messages from database
  var collection = req.db.get('messages');
  var user = req.session.user;

  collection.find({}, {sort: {date: -1}}, function (e, docs) {
    res.render('search', {
      "messages" : docs,
      "title": "Alle berichten",
      "moment": moment,
      "user": user
    });
  });
};

exports.execute = function(req, res){

  var search_query = req.body.search_query;
  res.redirect('/search/' + search_query);

}
