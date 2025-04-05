const express = require('express');
const path = require('path');
const session = require('express-session');
// const { PDFNet } = require('@pdftron/pdfnet-node');

// Load our library that generates the document
const Docxtemplater = require("docxtemplater");
// Load PizZip library to load the docx/pptx/xlsx file in memory
const PizZip = require("pizzip");
const fs = require("fs");



const app = express();
const port = process.env.PORT || 8080;

const admin = require('firebase-admin');
const credentials = require('./key.json');

class Activity {
  constructor(sl,name, list, networkingDone, networkingTarget, infosDone, infosTarget,reinfosDone, reinfosTarget, meetupsDone, 
      meetupsTarget, invisDone, invisTarget, plans, pendingPlans, remarks) {
      (this.sl = sl),
      (this.name = name),
      (this.list = list),
      (this.networkingDone = networkingDone),
      (this.networkingTarget = networkingTarget),
      (this.infosDone = infosDone),
      (this.infosTarget = infosTarget),
      (this.reinfosDone = reinfosDone),
      (this.reinfosTarget = reinfosTarget),
      (this.meetupsDone = meetupsDone),
      (this.meetupsTarget = meetupsTarget),
      (this.invisDone = invisDone),
      (this.invisTarget = invisTarget),
      (this.plans = plans),
      (this.pendingPlans = pendingPlans),
      (this.remarks = remarks);
  }
}

admin.initializeApp({
  credential : admin.credential.cert(credentials)
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

app.use(express.urlencoded({extended:true}));

const requireAuth = (req, res, next) => {
  if (req.session.userId) {
      next(); // User is authenticated, continue to next middleware
  } else {
      res.redirect('/login'); // User is not authenticated, redirect to login page
  }
}


app.use(express.static(path.join(__dirname, 'public')));


//Activity page 

app.post("/getData",requireAuth, async (req,res) => {
    // console.log(req);
    try{
        const year = req.body.year;
        const week = req.body.week;
        const data = await getCollectionData('users', year, week);
        res.send(data);
    }catch(err){
      res.send(err);
    }
  });

app.post("/updateUser",requireAuth, async (req,res)=>{

    try{
      const name = req.body.name;
      const week = req.body.week;
      const year = req.body.year;
      const fieldName = req.body.fieldName;
      const value = req.body.value;
  
      var userJson = '{"' + fieldName + '" : ' + value + '}';
      if(fieldName == "remarks"){
        userJson = '{"' + fieldName + '" : "' + value + '"}';
      }
      // console.log(userJson);
      const obj = JSON.parse(userJson);
      // console.log(obj);
  
  
        db.collection("users").doc(name).collection(year).doc(week).update(obj);
  
      // const response = db.collection("users").doc(name).collection("2025").doc(week).set(userJson);
      res.send("success");
    }catch(err){
      res.send(err);
    }
  });

async function getCollectionData(collection, year, week) {

  const snapshot = await db.collection(collection).listDocuments();
  const docArray = [];


  for(let i =0; i < snapshot.length; i++)
  {
    
    const snap = await db.collection(collection).doc(snapshot[i].id).collection(year).doc(week).get();
      
    const activity = new Activity(
      i+1,snapshot[i].id, snap.data().list, snap.data().networkingDone, snap.data().networkingTarget, snap.data().infosDone, snap.data().infosTarget,
      snap.data().reinfosDone, snap.data().reinfosTarget, snap.data().meetupsDone, snap.data().meetupsTarget,
      snap.data().invisDone, snap.data().invisTarget, snap.data().plans, snap.data().pendingPlans, snap.data().remarks
    );

    docArray.push(activity);

  }

  return docArray;
}

//Team page 

app.post("/addUser",requireAuth, async (req,res)=>{
    // console.log(req);
    try{
      const name = req.body.name;
      const userJson = {
        list : 0,
        networkingDone : 0,
        networkingTarget : 0,
        infosDone : 0,
        infosTarget : 0,
        reinfosDone : 0,
        reinfosTarget : 0,
        meetupsDone : 0,
        meetupsTarget :0,
        invisDone :0,
        invisTarget :0,
        plans : 0,
        pendingPlans :0,
        remarks : ""
      };
  
      const d = new Date();
      let year = d.getFullYear();
      // console.log(year + 1);
  
      for(let i=1; i<=53; i++){
        db.collection("users").doc(name).collection(year.toString()).doc(i.toString()).set(userJson);
        db.collection("users").doc(name).collection((year + 1).toString()).doc(i.toString()).set(userJson);
      }
      db.collection("users").doc(name).set({namelist_link : ""});
      res.send("success");
    }catch(err){
      res.send(err);
    }
  });


app.post("/getNames",requireAuth, async(req,res) =>{
  
    const docArray = await getUserNames();
   
    res.send(docArray);
  });

async function getUserNames(){
    const snapshot = await db.collection("users").listDocuments();
    const docArray = [];
    for(let i =0; i < snapshot.length; i++)
      {
        const namelist_link = await db.collection("users").doc(snapshot[i].id).get();
        // console.log(namelist_link.data());
        docArray.push({name : snapshot[i].id, namelist : namelist_link.data().namelist_link});
      }
    return docArray;
}

app.post("/updateNamelist", requireAuth, async (req,res) => {
    const name = req.body.name;
    const link = req.body.link;
  
    const namelistJson = {namelist_link : link};
  
    db.collection("users").doc(name).set(namelistJson);
  
    res.redirect("/add");
  });

app.post("/delete",requireAuth, async (req,res) => {
    // console.log(req.query);
    // res.send(req.query.name);
  
  
    const name = req.body.name;
    // console.log(name);
    await db.recursiveDelete(db.collection("users").doc(name));
    // console.log("done");
  
    // res.redirect('/add');
  });


//Analyze page

app.get('/getUserName',requireAuth, async function(req, res) {
  const docArray = await getUserNames();
  res.send(docArray);
});

app.post("/analyzeData",requireAuth, async (req,res) => {
  // console.log(req);
  try{
      const year = req.body.year;
      const weekFrom = req.body.weekFrom;
      const weekTo = req.body.weekTo;
      const name = req.body.name;

      const data = await getAnalyzeData('users', year, weekFrom, weekTo, name);
      res.send(data);
  }catch(err){
    res.send(err);
  }
});

async function getAnalyzeData(collection, year, weekFrom, weekTo, name) {

  const snapshot = await db.collection(collection).doc(name.toString()).collection(year.toString()).listDocuments();
  const docArray = [];
  const idArray = [];

  let sl = 1;

  for(let i =1; i <= snapshot.length; i++){
    if(parseInt(snapshot[i-1].id)>= parseInt(weekFrom) && parseInt(snapshot[i-1].id) <= parseInt(weekTo)){
      idArray.push(parseInt(snapshot[i-1].id));
    }
  }

  idArray.sort(function(a, b){return a - b});

  for(let j =0; j < idArray.length; j++){
      const snap = await db.collection(collection).doc(name.toString()).collection(year.toString()).doc(idArray[j].toString()).get();

      const activity = new Activity(
      sl,parseInt(idArray[j]), snap.data().list, snap.data().networkingDone, snap.data().networkingTarget, snap.data().infosDone, snap.data().infosTarget,
      snap.data().reinfosDone, snap.data().reinfosTarget, snap.data().meetupsDone, snap.data().meetupsTarget,
      snap.data().invisDone, snap.data().invisTarget, snap.data().plans, snap.data().pendingPlans, snap.data().remarks
      );

      sl++;

      docArray.push(activity);
  }

  return docArray;
}

//Utilities page

//method for generating legal doc for Utilities
app.post("/generateLegalDoc",requireAuth, async (req,res) => {
  try{

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
}catch(err){
  res.send(err);
}
});

function createLegalDocumentAndDeclaration(
  prospectName,prospectAddress,irID,amt,amtWords,
  bankAcc,bankName,irName,irAddress,
  product1="",product2="",product3="",product4="",product5=""
){

  const inputPathDeclaration = path.resolve(__dirname,"./files/DECLARATION.docx");
  const outputPathDeclaration = path.resolve(__dirname,"./public/legal/DECLARATION - "+ prospectName +".docx");

  const inputPathLegal = path.resolve(__dirname,"./files/LEGAL.docx");
  const outputPathLegal = path.resolve(__dirname,"./public/legal/LEGAL DOCUMENT - "+ prospectName +".docx");


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

return [outputPathLegal,outputPathDeclaration];
}





// Routes will go here

app.get('/',requireAuth, function(req, res) {
  // res.render('dashboard', {userName : req.session.userId, page : 'dash'});
  res.redirect("/view");
});

app.get('/Login', function(req, res) {
  res.render( 'login');
});

app.post('/Login', function(req, res) {

  if (req.body.userID == "Admin" && req.body.pass == "123") {
    req.session.userId = req.body.userID; // Set session identifier
    res.redirect('/');
    } else {
      res.render( 'login');
  }
  
});

app.get('/logout',requireAuth, function(req,res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
});

app.get('/view',requireAuth, function(req, res) {
  res.render('view', {userName : req.session.userId,page : 'view'});
});

app.get('/add',requireAuth, async function(req, res) {
  res.render('add',{userName : req.session.userId, page : 'add'});
});

app.get('/profile',requireAuth, function(req, res) {
  res.render('profile',{userName : req.session.userId, page : 'profile'});
});

app.get('/analyze',requireAuth, async function(req, res) {
  res.render('analyze',{userName : req.session.userId, page : 'analyze'});
});

async function getUserNames(){
  const snapshot = await db.collection("users").listDocuments();
  const docArray = [];
  for(let i =0; i < snapshot.length; i++)
    {
      const namelist_link = await db.collection("users").doc(snapshot[i].id).get();
      // console.log(namelist_link.data());
      docArray.push({name : snapshot[i].id, namelist : namelist_link.data().namelist_link});
    }
  return docArray;
}





app.get('/utilities',requireAuth, function(req, res) {
  
  res.render('utilities',{userName : req.session.userId,page : 'utilities'});
});


//The 404 Route (ALWAYS Keep this as the last route)
// app.get('*',requireAuth, function(req, res){
//   res.render('404',{page : '404'});
// });

// app.post('*',requireAuth, function(req, res){
//   res.render('404',{page : '404'});
// });

app.listen(port);
console.log('Server started at http://localhost:' + port);