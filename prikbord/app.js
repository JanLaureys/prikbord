var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongodb');

var site = require('./middleware/index');
var users = require('./middleware/users');
var messages = require('./middleware/messages');
var search = require('./middleware/search');
var admin = require('./middleware/admin');
var auth = require('./middleware/authentication');
var notifications = require('./middleware/notifications');

var monk = require('monk');
var db = monk('localhost:27017/prikbord');

// Run update on multiple docs
db.options.multi =true;

var session = require('express-session')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Setup the title of the app
app.set('title', 'Prikbord');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'Narwhals narwhals swimming in the ocean, causing a commotion cause they are so awesome', resave: true, saveUninitialized: true}));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

console.log('Prikbord is up and running. Checkout localhost:3000');

app.use(cookieParser());

// Defining routes

app.all('/', auth.checkLogin);
app.all('/messages/*', auth.checkLogin);
app.all('/message/*', auth.checkLogin);
app.all('/logout', auth.checkLogin);
app.all('/users/*', auth.checkLogin);
app.all('/search/*', auth.checkLogin);
app.all('/notifications/*', auth.checkLogin);
app.all('/admin/*', auth.checkLogin);
app.all('/admin/*', auth.checkAdmin);

// INDEX AND LOGIN
app.get('/', site.index);
app.get('/login', site.loginForm);
app.get('/login/:uid', site.login);
app.get('/logout', site.logout);


// MESSAGE ROUTES
app.get('/messages/new', messages.new.form);
app.get('/messages/detail/:mid', messages.detail);
app.post('/messages/new', messages.new.post);
app.get('/messages/unresolved', messages.unresolved.view);
app.get('/messages/unresolved/count', messages.unresolved.count);
app.post('/messages/resolve', messages.resolve);
app.post('/messages/:mid/comment', messages.comments.add);

// USER ROUTES
app.get('/users', users.all);

// SEARCH ROUTES
app.get('/search/:query', search.results);
app.get('/search/', search.all);
app.post('/search/submit', search.execute);

// NOTIFICATION ROUTES
app.get('/notifications/html', notifications.get);
app.get('/notifications/json', notifications.getJSON);
app.post('/notifications/showOnDesktop', notifications.shownOnDesktop);
app.get('/notifications/clear', notifications.clear);

// ADMIN ROUTES

app.get('/admin', admin.index);
app.get('/admin/users', admin.users.all);
app.get('/admin/users/:uid', admin.users.view);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
