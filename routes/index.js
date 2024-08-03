var express = require('express');
var router = express.Router();

// Restrict function to protect routes
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', restrict, function(req, res, next) {
  res.render('index', { title: 'Task Master', user: req.session.user });
});

/* GET logout. */
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;
