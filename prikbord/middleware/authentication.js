exports.checkLogin = function(req, res, next){
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
}

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
}