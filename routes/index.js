var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');


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
  
      const json = JSON.parse(data);
      const userTasks = json[userId];
      let categories = [];
      let tasks = [];

      for (const category in userTasks) {
        if (userTasks.hasOwnProperty(category)) {
          categories.push(category);
          for (const task in category) {
            tasks.push(task);
          }
        }
      }

      
  
      res.render('index', {
        title: 'Task Master',
        user: req.session.user,
        tasks: tasks,
        categories: categories
      });
    });
  });
  
router.post('/addTask', function(req, res, next) {
    const { taskName, taskDesc, taskTime, category } = req.body;
    const user = req.session.user.name; 
    const db = readDB();
  
    const newTask = {
      id: uuidv4(),
      taskName,
      taskDesc: taskDesc || '',
      taskTime,
      owner: req.session.user.name,
      done: false,
      category: category
    };
  
    if (!db[user]) {
      db[user] = [];
    }
    if (category) {
        db[user][category].push(newTask);
    }else {
        db[user].push(newTask);
    }
    
    writeDB(db);

    res.redirect('/');
});

router.post('/create-category', async (req, res) => {
    const { categoryName } = req.body;
    
    // Read the database
    const db = readDB();

    if (!db[req.session.user.name]) { db[req.session.user.name] = {}};
    db[req.session.user.name][categoryName] = [];

    // Write the updated database
    writeDB(db);

    // Redirect to the home page
    res.redirect('/');
});

router.post('/markAsDone/:id', (req, res) => {
    var db = readDB();

    let taskId = req.params.id;
    console.log(taskId);
     
    let task = db[req.session.user.name].find(t => t.id === taskId);

    if (task) {
      console.log("got task");
      task.done = true;
      
      writeDB(db);
    }
    res.redirect('/');
});

router.post('/deleteTask/:id', (req, res) => {
    var db = readDB();
    let taskId = req.params.id;
    tasks = db[req.session.user.name].filter(t => t.id !== taskId);

    writeDB(tasks);

    res.redirect('/');
});
/* GET logout. */
router.get('/logout', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

module.exports = router;
