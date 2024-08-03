var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var table_path = path.join(__dirname, '../db/table.json');

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
  var json = JSON.parse(fs.readFileSync(table_path));
  res.render('index', { title: 'Task Master', user: req.session.user, table: json[req.session.user.name] });
});

/* GET logout. */
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;
