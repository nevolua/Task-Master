var express = require('express');
var router = express.Router();
var fs = require('fs');
var hash = require('pbkdf2-password')();
var path = require('path');

var usersFilePath = path.join(__dirname, '../db/auth.json');

// Helper function to read JSON file
function readUsersFile(callback) {
  fs.readFile(usersFilePath, 'utf8', function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        // File does not exist, create an empty object
        return callback(null, {});
      }
      return callback(err);
    }
    try {
      var json = JSON.parse(data);
      callback(null, json);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

// Helper function to write JSON file
function writeUsersFile(json, callback) {
  fs.writeFile(usersFilePath, JSON.stringify(json, null, 2), 'utf8', callback);
}

// Function to create a user
function createUser(username, password, callback) {
  hash({ password: password }, function (err, pass, salt, hash) {
    if (err) return callback(err);
    readUsersFile(function (err, users) {
      if (err) return callback(err);
      users[username] = { name: username, salt: salt, hash: hash };
      writeUsersFile(users, callback);
    });
  });
}

// Authentication function
function authenticate(name, pass, fn) {
  readUsersFile(function (err, users) {
    if (err) return fn(err);
    var user = users[name];
    if (!user) return fn(null, null);
    hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
      if (err) return fn(err);
      if (hash === user.hash) return fn(null, user);
      fn(null, null);
    });
  });
}

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { message: res.locals.message });
});

/* POST login. */
router.post('/login', function (req, res, next) {
  authenticate(req.body.username, req.body.password, function(err, user) {
    if (err) return next(err);
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. ';
        res.redirect('/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your username and password.';
      res.redirect('/login');
    }
  });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { message: res.locals.message });
});

/* POST signup. */
router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  readUsersFile(function (err, users) {
    if (err) return next(err);
    if (users[username]) {
      req.session.error = 'Username already taken.';
      res.redirect('/signup');
    } else {
      createUser(username, password, function (err) {
        if (err) return next(err);
        req.session.success = 'Account created! Please log in.';
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;
