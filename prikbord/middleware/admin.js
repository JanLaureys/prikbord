var moment = require('moment');

exports.users = {

  all: function (req, res) {
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
  },
  view: function (req, res) {

    var collection = req.db.get('users');
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
  }
}

exports.index = function(req, res){

  res.render('admin/dashboard');


}
