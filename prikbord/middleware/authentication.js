exports.checkIdentity = function(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
};

exports.checkAdmin = function(req, res, next){
  if(req.session.user){
    if(req.session.admin){
      next();
    } else {
      res.redirect('/');
    }
  } else {
    res.redirect('/login');
  }
};

exports.checkAuth = function(req, res, next){
  if(req.session.auth){
    next();
  } else {
    res.redirect('/auth');
  }
};

exports.checkAuthandLogin = function(req, res, next){
  if(req.session.auth){
    if(req.session.user || req.session.admin){
      if(req.session.user){
        res.locals.user = req.session.user;
      }
      next()
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/auth');
  }
};

exports.checkAuthandAdmin = function(req, res, next){
  if(req.session.auth){
    if(req.session.admin){
      next();
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/auth');
  }
};