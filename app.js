const express = require('express');
const path = require('path');
const session = require('express-session');
// const { PDFNet } = require('@pdftron/pdfnet-node');

// Load our library that generates the document
const Docxtemplater = require("docxtemplater");
// Load PizZip library to load the docx/pptx/xlsx file in memory
const PizZip = require("pizzip");
const fs = require("fs");
var _ = require('lodash');



const app = express();
const port = process.env.PORT || 8080;

const admin = require('firebase-admin');
const credentials = require('./key.json');


function getFields(group) {
  const fields = [];
  const data = fs.readFileSync('./settings.conf', 'utf8');

  if (group == "SKB") {
    const SKB_table = JSON.parse(data).SKB_table;
    for (let i = 0; i < SKB_table.length; i++) {
      // addField(SKB_table[i].header);

      if (SKB_table[i].sub_heading.length > 0) {
        for (let j = 0; j < SKB_table[i].sub_heading.length; j++) {
          // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
          fields.push(camelize((SKB_table[i].header + SKB_table[i].sub_heading[j]).toString()));
        }
      } else {
        fields.push(camelize(SKB_table[i].header));
      }
    }
  } else if (group == "Sapphire") {
    const Sapphire_table = JSON.parse(data).Sapphire_table;
    for (let i = 0; i < Sapphire_table.length; i++) {
      // addField(SKB_table[i].header);

      if (Sapphire_table[i].sub_heading.length > 0) {
        for (let j = 0; j < Sapphire_table[i].sub_heading.length; j++) {
          // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
          fields.push(camelize((Sapphire_table[i].header + Sapphire_table[i].sub_heading[j]).toString()));
        }
      } else {
        fields.push(camelize(Sapphire_table[i].header));
      }
    }
  }

  return fields;
}

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

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

    data = await getCollectionData(group, year, week);


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


    var userJson = '{"' + fieldName + '" : ' + value + '}';
    if (fieldName == "remarks") {
      userJson = '{"' + fieldName + '" : "' + value + '"}';
    }
    // console.log(userJson);
    const obj = JSON.parse(userJson);
    // console.log(obj);

    if (group == "SKB") {
      db.collection("users").doc(name).collection(year).doc(week).update(obj);
    } else {
      db.collection("sapphire").doc(name).collection(year).doc(week).update(obj);
    }

    // const response = db.collection("users").doc(name).collection("2025").doc(week).set(userJson);
    res.send("success");
  } catch (err) {
    res.send(err);
  }
});

async function getCollectionData(group, year, week) {

  var collection = "";

  if (group == "SKB") {
    collection = "users";
  } else {
    collection = "sapphire";
  }

  const snapshot = await db.collection(collection).listDocuments();
  const docArray = [];

  for (let i = 0; i < snapshot.length; i++) {

    const snap = await db.collection(collection).doc(snapshot[i].id).collection(year).doc(week).get();

    var dataRow = "{";
    dataRow += ' "sl" : "' + (i + 1) + '",';
    dataRow += ' "name" : "' + snapshot[i].id + '",';
    var fields = getFields(group);
    fields.push("remarks");

    for (let i = 0; i < fields.length; i++) {
      dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
      // dataRow.push(snap.data()[fields[i]]);
      if (i != fields.length - 1) {
        dataRow += ',';
      }
    }
    dataRow += '}';

    docArray.push(JSON.parse(dataRow));

  }

  // console.log(docArray);
  return docArray;
}

//Team page 

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

// console.log(camelize("Pending Plans"));

app.post("/addUser", requireAuth, async (req, res) => {
  const name = req.body.name;
  const group = req.body.group;

  const fields = getFields(group);

  var test = "{";
  for (let i = 0; i < fields.length; i++) {
    test += '"' + fields[i] + '" : 0,';
  }
  test = test + ' "remarks" : "" }';

  // console.log(JSON.parse(test));

  if (group == "SKB") {

    const userJson = JSON.parse(test);

    const d = new Date();
    let year = d.getFullYear();
    // console.log(year + 1);

    for (let i = 1; i <= 53; i++) {
      await db.collection("users").doc(name).collection(year.toString()).doc(i.toString()).set(userJson);
      await db.collection("users").doc(name).collection((year + 1).toString()).doc(i.toString()).set(userJson);
    }
    await db.collection("users").doc(name).set({ namelist_link: "" });
  } else {
    const userJson = JSON.parse(test);

    const d = new Date();
    let year = d.getFullYear();

    for (let i = 1; i <= 53; i++) {
      await db.collection("sapphire").doc(name).collection(year.toString()).doc(i.toString()).set(userJson);
      await db.collection("sapphire").doc(name).collection((year + 1).toString()).doc(i.toString()).set(userJson);
    }
    // db.collection("sapphire").doc(name).set({namelist_link : ""});

  }

  res.send("success");

});


app.post("/getNames", requireAuth, async (req, res) => {

  const docArray = await getUserNames();

  res.send(docArray);
});

async function getUserNames() {
  const snapshot = await db.collection("users").listDocuments();
  const docArray = [];
  for (let i = 0; i < snapshot.length; i++) {
    const namelist_link = await db.collection("users").doc(snapshot[i].id).get();
    // console.log(namelist_link.data());
    docArray.push({ name: snapshot[i].id, namelist: namelist_link.data().namelist_link });
  }
  return docArray;
}

app.post("/getNamesSapphire", requireAuth, async (req, res) => {

  const docArray = await getUserNamesSapphire();

  res.send(docArray);
});

async function getUserNamesSapphire() {
  const snapshot = await db.collection("sapphire").listDocuments();
  const docArray = [];
  for (let i = 0; i < snapshot.length; i++) {
    docArray.push({ name: snapshot[i].id });
  }
  return docArray;
}



app.post("/updateNamelist", requireAuth, async (req, res) => {
  const name = req.body.name;
  const link = req.body.link;

  const namelistJson = { namelist_link: link };

  db.collection("users").doc(name).set(namelistJson);

  res.redirect("/add");
});

app.post("/delete", requireAuth, async (req, res) => {
  // console.log(req.query);
  // res.send(req.query.name);


  const name = req.body.name;
  const group = req.body.group;

  if (group == "SKB") {
    await db.recursiveDelete(db.collection("users").doc(name));
  } else {
    await db.recursiveDelete(db.collection("sapphire").doc(name));
  }
  // console.log(name);

  // console.log("done");

  // res.redirect('/add');
});


//Analyze page

app.post('/getUserName', requireAuth, async function (req, res) {
  const group = req.body.group;
  // console.log(group);
  var docArray = [];

  if (group == "SKB") {
    docArray = await getUserNames();
  } else {
    docArray = await getUserNamesSapphire();
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


    const data = await getAnalyzeData(year, weekFrom, weekTo, name, group);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

async function getAnalyzeData(year, weekFrom, weekTo, name, group) {
  const docArray = [];
  const idArray = [];

  if (group == "SKB") {
    const snapshot = await db.collection("users").doc(name.toString()).collection(year.toString()).listDocuments();
    let sl = 1;

    for (let i = 1; i <= snapshot.length; i++) {
      if (parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) && parseInt(snapshot[i - 1].id) <= parseInt(weekTo)) {
        idArray.push(parseInt(snapshot[i - 1].id));
      }
    }

    idArray.sort(function (a, b) { return a - b });

    for (let j = 0; j < idArray.length; j++) {
      const snap = await db.collection("users").doc(name.toString()).collection(year.toString()).doc(idArray[j].toString()).get();

      var dataRow = "{";
      dataRow += ' "sl" : "' + sl + '",';
      dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
      var fields = getFields(group);

      for (let i = 0; i < fields.length; i++) {
        dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
        // dataRow.push(snap.data()[fields[i]]);
        if (i != fields.length - 1) {
          dataRow += ',';
        }
      }
      dataRow += '}';

      sl++;

      docArray.push(JSON.parse(dataRow));
    }
  } else {
    const snapshot = await db.collection("sapphire").doc(name.toString()).collection(year.toString()).listDocuments();
    let sl = 1;

    for (let i = 1; i <= snapshot.length; i++) {
      if (parseInt(snapshot[i - 1].id) >= parseInt(weekFrom) && parseInt(snapshot[i - 1].id) <= parseInt(weekTo)) {
        idArray.push(parseInt(snapshot[i - 1].id));
      }
    }

    idArray.sort(function (a, b) { return a - b });

    for (let j = 0; j < idArray.length; j++) {
      const snap = await db.collection("sapphire").doc(name.toString()).collection(year.toString()).doc(idArray[j].toString()).get();

      var dataRow = "{";
      dataRow += ' "sl" : "' + sl + '",';
      dataRow += ' "week" : "Week ' + parseInt(idArray[j]) + '",';
      var fields = getFields(group);

      for (let i = 0; i < fields.length; i++) {
        dataRow += '"' + fields[i] + '" : "' + snap.data()[fields[i]] + '"';
        // dataRow.push(snap.data()[fields[i]]);
        if (i != fields.length - 1) {
          dataRow += ',';
        }
      }
      dataRow += '}';

      sl++;

      docArray.push(JSON.parse(dataRow));
    }
  }

  // console.log(docArray);
  return docArray;
}

//Utilities page

//method for generating legal doc for Utilities
app.post("/generateLegalDoc", requireAuth, async (req, res) => {
  try {

    const outputFiles = createLegalDocumentAndDeclaration(
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

function createLegalDocumentAndDeclaration(
  prospectName, prospectAddress, irID, amt, amtWords,
  bankAcc, bankName, irName, irAddress,
  product1 = "", product2 = "", product3 = "", product4 = "", product5 = ""
) {

  const inputPathDeclaration = path.resolve(__dirname, "./files/DECLARATION.docx");
  const outputPathDeclaration = path.resolve(__dirname, "./public/legal/DECLARATION - " + prospectName + ".docx");

  const inputPathLegal = path.resolve(__dirname, "./files/LEGAL.docx");
  const outputPathLegal = path.resolve(__dirname, "./public/legal/LEGAL DOCUMENT - " + prospectName + ".docx");


  //Declaration

  //Load the docx file as binary content
  const content = fs.readFileSync(
    inputPathDeclaration,
    "binary"
  );
  // Unzip the content of the file
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.render({
    prospectName: prospectName,
    prospectAddress: prospectAddress,
    irID: irID,
    amt: amt,
    amtWords: amtWords,
    bankAcc: bankAcc,
    bankName: bankName,
    irName: irName,
    irAddress: irAddress,
    product1: product1,
    product2: product2,
    product3: product3,
    product4: product4,
    product5: product5

  });

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    /*
     * Compression: DEFLATE adds a compression step.
     * For a 50MB document, expect 500ms additional CPU time.
     */
    compression: "DEFLATE",
  });

  // Write the Node.js Buffer to a file
  fs.writeFileSync(outputPathDeclaration, buf);


  // //Legal

  // Load the docx file as binary content
  const contentLegal = fs.readFileSync(
    inputPathLegal,
    "binary"
  );
  // Unzip the content of the file
  const zipLegal = new PizZip(contentLegal);
  const docLegal = new Docxtemplater(zipLegal, {
    paragraphLoop: true,
    linebreaks: true,
  });
  docLegal.render({
    prospectName: prospectName,
    prospectAddress: prospectAddress,
    amt: amt,
    amtWords: amtWords,
    irName: irName,
    irAddress: irAddress,
  });

  const bufLegal = docLegal.getZip().generate({
    type: "nodebuffer",
    /*
     * Compression: DEFLATE adds a compression step.
     * For a 50MB document, expect 500ms additional CPU time.
     */
    compression: "DEFLATE",
  });

  // Write the Node.js Buffer to a file
  fs.writeFileSync(outputPathLegal, bufLegal);

  return [outputPathLegal, outputPathDeclaration];
}

//Settings Page

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

  const data = fs.readFileSync('./settings.conf', 'utf8');

  const settingsJson = JSON.parse(data);

  console.log("save settings clicked");

  // await addField("helloWorld", "SKB");
  // await deleteField("helloWorld", "SKB");

  if (!_.isEqual(config, settingsJson)) {
    var addDelField = new Map();

    //Check new SKB Table ADD / Edit

    for (let i = 0; i < config.SKB_table.length; i++) {
      if (config.SKB_table[i].isAdded) {
        //Newly added field
        // 
        // await addField(camelize(config.SKB_table[i].header), "SKB");
        if (config.SKB_table[i].sub_heading.length > 0) {
          for (let j = 0; j < config.SKB_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            addDelField.set(camelize((config.SKB_table[i].header + config.SKB_table[i].sub_heading[j]).toString()), 0);
            // config.SKB_table[i].isAdded = false;
          }
        } else {
          addDelField.set(camelize(config.SKB_table[i].header), 0);

        }
        config.SKB_table[i].isAdded = false;
      } else {
        if (config.SKB_table[i].isEdited) {
          //Edited field..change in DB

          if (config.SKB_table[i].sub_heading.length > 0) {
            for (let j = 0; j < config.SKB_table[i].sub_heading.length; j++) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              await renameField(camelize((config.SKB_table[i].header + config.SKB_table[i].sub_heading[j]).toString()), camelize((config.SKB_table[i].prev + config.SKB_table[i].sub_heading[j]).toString()), "SKB");

            }
          } else {
            await renameField(camelize(config.SKB_table[i].header), camelize(config.SKB_table[i].prev), "SKB");
          }

          config.SKB_table[i].prev = "";
          config.SKB_table[i].isEdited = false;
        }
      }
    }

    //Check for Delete
    for (let i = 0; i < settingsJson.SKB_table.length; i++) {
      var notFound = true;

      for (let j = 0; j < config.SKB_table.length; j++) {
        if (settingsJson.SKB_table[i].header == config.SKB_table[j].header) {
          notFound = false;
          break;
        }
      }
      if (notFound) {
        //Add delete field
        if (settingsJson.SKB_table[i].sub_heading.length > 0) {
          for (let j = 0; j < settingsJson.SKB_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            addDelField.set(camelize((settingsJson.SKB_table[i].header + settingsJson.SKB_table[i].sub_heading[j]).toString()), admin.firestore.FieldValue.delete());
          }
        } else {
          addDelField.set(camelize(settingsJson.SKB_table[i].header), admin.firestore.FieldValue.delete());
        }
      }
    }

    if(addDelField.size > 0){
      const obj = Object.fromEntries(addDelField);
      await updateFields(obj, "SKB");
    }

    //Check new Sapphire Table ADD / Edit

    addDelField = new Map();

    for (let i = 0; i < config.Sapphire_table.length; i++) {
      if (config.Sapphire_table[i].isAdded) {
        //Newly added field
        // 
        // await addField(camelize(config.SKB_table[i].header), "SKB");
        if (config.Sapphire_table[i].sub_heading.length > 0) {
          for (let j = 0; j < config.Sapphire_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            addDelField.set(camelize((config.Sapphire_table[i].header + config.Sapphire_table[i].sub_heading[j]).toString()), 0);
            // config.SKB_table[i].isAdded = false;
          }
        } else {
          addDelField.set(camelize(config.Sapphire_table[i].header), 0);

        }
        config.Sapphire_table[i].isAdded = false;
      } else {
        if (config.Sapphire_table[i].isEdited) {
          //Edited field..change in DB

          if (config.Sapphire_table[i].sub_heading.length > 0) {
            for (let j = 0; j < config.Sapphire_table[i].sub_heading.length; j++) {
              // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
              await renameField(camelize((config.Sapphire_table[i].header + config.Sapphire_table[i].sub_heading[j]).toString()), camelize((config.Sapphire_table[i].prev + config.Sapphire_table[i].sub_heading[j]).toString()), "Sapphire");

            }
          } else {
            await renameField(camelize(config.Sapphire_table[i].header), camelize(config.Sapphire_table[i].prev), "Sapphire");
          }

          config.Sapphire_table[i].prev = "";
          config.Sapphire_table[i].isEdited = false;
        }
      }
    }

    //Check for Delete
    for (let i = 0; i < settingsJson.Sapphire_table.length; i++) {
      var notFound = true;

      for (let j = 0; j < config.Sapphire_table.length; j++) {
        if (settingsJson.Sapphire_table[i].header == config.Sapphire_table[j].header) {
          notFound = false;
          break;
        }
      }
      if (notFound) {
        //Add delete field
        if (settingsJson.Sapphire_table[i].sub_heading.length > 0) {
          for (let j = 0; j < settingsJson.Sapphire_table[i].sub_heading.length; j++) {
            // addSubField(SKB_table[i].sub_heading[j], SKB_table[i].header);
            addDelField.set(camelize((settingsJson.Sapphire_table[i].header + settingsJson.Sapphire_table[i].sub_heading[j]).toString()), admin.firestore.FieldValue.delete());
          }
        } else {
          addDelField.set(camelize(settingsJson.Sapphire_table[i].header), admin.firestore.FieldValue.delete());
        }
      }
    }

    if(addDelField.size > 0){
      const obj = Object.fromEntries(addDelField);
      await updateFields(obj, "Sapphire");
    }

  }

  try {
    fs.writeFile('./settings.conf', JSON.stringify(config, null, 2), function (err) {
      if (err) throw err;
      // console.log('Saved!');
      res.send("Saved");
    });

  } catch (err) {
    res.send(err);
  }
});

async function renameField(newFieldName, oldFieldName, group) {
  var collection = "";

  if (group == "SKB") {
    collection = "users";
  } else {
    collection = "sapphire";
  }

  const d = new Date();
  let year = d.getFullYear();

  const snapshot = await db.collection(collection).listDocuments();

  for (let i = 0; i < snapshot.length; i++) {
    for (let j = 1; j <= 53; j++) {

      var snap = await db.collection(collection).doc(snapshot[i].id).collection(year.toString()).doc(j.toString()).get();

      var addDelField = new Map();
      var prevData = snap.data()[oldFieldName];
      addDelField.set(newFieldName, prevData);
      // addDelField.set(oldFieldName, admin.firestore.FieldValue.delete());

      var obj = Object.fromEntries(addDelField);
      await db.collection(collection).doc(snapshot[i].id).collection(year.toString()).doc(j.toString()).update(obj);

      snap = await db.collection(collection).doc(snapshot[i].id).collection((year + 1).toString()).doc(j.toString()).get();

      addDelField = new Map();
      prevData = snap.data()[oldFieldName];
      addDelField.set(newFieldName, prevData);
      // addDelField.set(oldFieldName, admin.firestore.FieldValue.delete());

      obj = Object.fromEntries(addDelField);
      await db.collection(collection).doc(snapshot[i].id).collection((year + 1).toString()).doc(j.toString()).update(obj);
    }

  }

  // console.log("Renamed Fields !");

}

async function updateFields(fieldObj, group) {
  var collection = "";
  if (group == "SKB") {
    collection = "users";
  } else {
    collection = "sapphire";
  }

  const d = new Date();
  let year = d.getFullYear();

  const snapshot = await db.collection(collection).listDocuments();

  for (let i = 0; i < snapshot.length; i++) {
    for (let j = 1; j <= 53; j++) {
      await db.collection(collection).doc(snapshot[i].id).collection(year.toString()).doc(j.toString()).update(fieldObj);//{ helloWorld : admin.firestore.FieldValue.delete()});
      await db.collection(collection).doc(snapshot[i].id).collection((year + 1).toString()).doc(j.toString()).update(fieldObj); //{ helloWorld : admin.firestore.FieldValue.delete()});
    }

  }

  console.log("Updated !");
}

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

async function getUserNames() {
  const snapshot = await db.collection("users").listDocuments();
  const docArray = [];
  for (let i = 0; i < snapshot.length; i++) {
    const namelist_link = await db.collection("users").doc(snapshot[i].id).get();
    // console.log(namelist_link.data());
    docArray.push({ name: snapshot[i].id, namelist: namelist_link.data().namelist_link });
  }
  return docArray;
}

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