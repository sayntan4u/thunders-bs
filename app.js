const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require("fs");
var _ = require('lodash');
var formidable = require('formidable');

const util = require("./lib/utilitiesmanager");



const app = express();
const port = process.env.PORT || 8080;

//Setup directories
var dir = ['./backup', './public/legal', './uploads'];

dir.forEach(function (currentValue, index, arr) {
  if (!fs.existsSync(currentValue)) {
    fs.mkdirSync(currentValue);
  }
});

const dbm = require("./lib/dbmanager");

app.set('view engine', 'ejs');

app.use(session({
  secret: 'Sapphire2025',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.redirect('/login'); // User is not authenticated, redirect to login page
  }
}


app.use(express.static(path.join(__dirname, 'public')));


//Activity page 

app.post("/getData", requireAuth, async (req, res) => {
  // console.log(req);
  try {
    const year = req.body.year;
    const week = req.body.week;
    const group = req.body.group;

    var data = [];

    data = await dbm.getCollectionData(group, year, week);

    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

app.post("/updateUser", requireAuth, async (req, res) => {

  try {
    const name = req.body.name;
    const week = req.body.week;
    const year = req.body.year;
    const fieldName = req.body.fieldName;
    const value = req.body.value;
    const group = req.body.group;


    // 
    dbm.updateUser(name, week, year, fieldName, value, group);

    // const response = db.collection("users").doc(name).collection("2025").doc(week).set(userJson);
    res.send("success");
  } catch (err) {
    res.send(err);
  }
});


//Team page 

app.post("/addUser", requireAuth, async (req, res) => {
  const name = req.body.name;
  const group = req.body.group;

  await dbm.addUser(name, group);
  res.send("success");

});


app.post("/getNames", requireAuth, async (req, res) => {

  const docArray = await dbm.getUserNames();

  res.send(docArray);
});

app.post("/getNamesSapphire", requireAuth, async (req, res) => {

  const docArray = await dbm.getUserNamesSapphire();
  res.send(docArray);
});

app.post("/updateNamelist", requireAuth, async (req, res) => {
  const name = req.body.name;
  const link = req.body.link;

  dbm.updateNamelist(name, link);

  res.redirect("/add");
});

app.post("/delete", requireAuth, async (req, res) => {
  const name = req.body.name;
  const group = req.body.group;

  await dbm.delete(name, group);

});


//Analyze page

app.post('/getUserName', requireAuth, async function (req, res) {
  const group = req.body.group;
  // console.log(group);
  var docArray = [];

  if (group == "SKB") {
    docArray = await dbm.getUserNames();
  } else {
    docArray = await dbm.getUserNamesSapphire();
  }

  res.send(docArray);
});

app.post("/analyzeData", requireAuth, async (req, res) => {
  // console.log(req);
  try {
    const year = req.body.year;
    const weekFrom = req.body.weekFrom;
    const weekTo = req.body.weekTo;
    const name = req.body.name;
    const group = req.body.group;


    const data = await dbm.getAnalyzeData(year, weekFrom, weekTo, name, group);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

//Utilities page

//method for generating legal doc for Utilities
app.post("/generateLegalDoc", requireAuth, async (req, res) => {
  try {

    const outputFiles = util.createLegalDocumentAndDeclaration(
      req.body.prospectName,
      req.body.prospectAddress,
      req.body.irID,
      req.body.amt,
      req.body.amtWords,
      req.body.bankName,
      req.body.bankAcc,
      req.body.irName,
      req.body.irAddress,
      req.body.product1,
      req.body.product2,
      req.body.product3,
      req.body.product4
    );
    // console.log(outputFiles);
    req.send(outputFiles);
  } catch (err) {
    res.send(err);
  }
});

//Closings Page

app.post('/getClosings', requireAuth, async function (req, res) {
  var docArray = [];
  docArray = await dbm.getClosings();
  // console.log(docArray);
  res.send(docArray);
});

app.post('/addClosing', requireAuth, async function (req, res) {
  await dbm.addClosing(req.body);
  res.send("added closing");
});

app.post('/updateClosingStatus', requireAuth, async function (req, res) {
  const id = req.body.id;
  const status = req.body.status;

  await dbm.updateClosingStatus(id, status);
  // console.log("updated");
});

app.post('/updateClosingUV', requireAuth, async function (req, res) {
  const id = req.body.id;
  const uv = req.body.uv;

  await dbm.updateClosingUV(id, uv);

  // console.log("updated");
});

app.post('/deleteClosing', requireAuth, async function (req, res) {
  const id = req.body.id;
  await dbm.deleteClosing(id);
  res.send("deleted !");
});


//Settings Page


app.get("/getStatus", requireAuth, async (req, res) => {
  res.send(dbm.statusJson);
});

app.post("/getSettings", requireAuth, async (req, res) => {
  try {
    fs.readFile('./settings.conf', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      // const json = JSON.parse(data);
      res.send(data);
    });

  } catch (err) {
    res.send(err);
  }
});

app.post("/saveSettings", requireAuth, async (req, res) => {
  const config = req.body.config;

  await dbm.saveSettings(config);

  res.send("success");
});

app.post("/export", requireAuth, async (req, res) => {
  const group = req.body.group;
  const field = req.body.field;

  dbm.statusJson.procName = "Export";

  const data = await dbm.getFullCollectionData(group, field);

  const dt = new Date();

  try {
    fs.writeFile(
      './backup/' + group + '_' + field + '_' + dt.toString().replace(/:/g, "") + '.db',
      JSON.stringify(data, null, 2),
      function (err) {
        if (err) throw err;
        // console.log('Saved!');
        res.send("Saved");
      });

  } catch (err) {
    res.send(err);
  }
});

app.post("/upload", requireAuth, async (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // console.log(files.file[0].filepath);
    var oldpath = files.file[0].filepath;
    var newpath = './uploads/' + files.file[0].originalFilename;
    fs.copyFileSync(oldpath, newpath);
    
    dbm.uploadFullCollectionData(newpath);
  });
});

// Routes will go here

app.get('/', requireAuth, function (req, res) {
  // res.render('dashboard', {userName : req.session.userId, page : 'dash'});
  res.redirect("/view");
});

app.get('/Login', function (req, res) {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    res.render('login');
  }

});

app.post('/Login', function (req, res) {

  if (req.body.userID == "Admin" && req.body.pass == "123") {
    req.session.userId = req.body.userID; // Set session identifier
    res.redirect('/');
  } else {
    res.render('login');
  }

});

app.get('/logout', requireAuth, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

app.get('/view', requireAuth, function (req, res) {
  res.render('view', { userName: req.session.userId, page: 'view' });
});

app.get('/add', requireAuth, async function (req, res) {
  res.render('add', { userName: req.session.userId, page: 'add' });
});

app.get('/settings', requireAuth, function (req, res) {
  res.render('settings', { userName: req.session.userId, page: 'settings' });
});

app.get('/analyze', requireAuth, async function (req, res) {
  res.render('analyze', { userName: req.session.userId, page: 'analyze' });
});


app.get('/utilities', requireAuth, function (req, res) {
  res.render('utilities', { userName: req.session.userId, page: 'utilities' });
});

app.get('/closing', requireAuth, function (req, res) {
  res.render('closing', { userName: req.session.userId, page: 'closing' });
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', requireAuth, function (req, res) {
  res.render('404', { userName: req.session.userId, page: '404' });
});

app.post('*', requireAuth, function (req, res) {
  res.render('404', { userName: req.session.userId, page: '404' });
});

app.listen(port, '0.0.0.0');
console.log('Server started at http://localhost:' + port);