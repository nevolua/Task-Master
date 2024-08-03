var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const dbPath = path.join(__dirname, '../db/table.json');

const readDB = () => {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

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
    const userId = req.session.user.name; // Assuming user ID is stored in session
  
    // Read and parse the JSON file
    const filePath = path.join(__dirname, '../db', 'table.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      const tasks = JSON.parse(data);
      const userTasks = tasks[userId] || [];
      
      res.render('index', {
        title: 'Task Master',
        user: req.session.user,
        tasks: userTasks
      });
    });
  });

router.post('/addTask', function(req, res, next) {
    const { taskName, taskDesc, taskTime } = req.body;
    const user = req.session.user.name; 
    const db = readDB();
  
    const newTask = {
      taskName,
      taskDesc: taskDesc || '',
      taskTime,
    };
  
    if (!db[user]) {
      db[user] = [];
    }
  
    db[user].push(newTask);
    writeDB(db);
  
    res.redirect('/');
  });

/* GET logout. */
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;
