const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./json/lab4-17758-firebase-adminsdk-63vkn-b86563f5cc.json');

const mongoose = require('mongoose');
const superhero_info = JSON.parse(fs.readFileSync("json/superhero_info.json"));
const superhero_powers = JSON.parse(fs.readFileSync("json/superhero_powers.json"));
const policy = JSON.parse(fs.readFileSync("json/policy.json"));
const complaints = JSON.parse(fs.readFileSync("json/complaints.json"));
const adminAccounts = JSON.parse(fs.readFileSync("json/admins.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lab4-17758-default-rtdb.firebaseio.com/',
  });

app.use(cors());
app.use(express.json());

//Connecting to MongoDB database
mongoose.connect('mongodb+srv://liamjohnxuyoell:DEiUUTiocuR8h5OK@lab4lyoell.qnrftmh.mongodb.net/?retryWrites=true&w=majority',{
dbName: 'ListDatabase',
useNewUrlParser:true,
useUnifiedTopology: true
}).then(()=>{
    console.log("MongoDB Connected")
})

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//Getting the policy.
app.get('/policy', (req,res) =>{
    res.json(policy);
});

// Rewriting the privacy policies.
app.post('/policyrewrite', (req,res) =>{
    const privacyUpdate = req.body.privacy;
    const aupUpdate = req.body.aup;
    const dmcaUpdate = req.body.dcma;
    console.log(privacyUpdate);
    console.log(aupUpdate);
    console.log(dmcaUpdate);

    if(privacyUpdate){
        policy.privacy = privacyUpdate;
    }
    if(aupUpdate){
        policy.aup = aupUpdate;
    }
    if(dmcaUpdate){
        policy.dcma = dmcaUpdate;
    }
         fs.writeFile("policy.json", JSON.stringify(policy), 'utf8', (err) => {
            if (err) {
                res.status(500).send("Error writing data.");
            } else {
                res.status(201).send("Success writing the data");
            }
        });
});

//Getting the pattern for the search functionality.
app.post('/superheroinfo', (req, res) => {
    const name = req.body['name'];
    const race = req.body['race'];
    const power = req.body['power'];
    const publisher = req.body['publisher'];
    console.log(name);
    console.log(race);
    console.log(power);
    console.log(publisher);

    let filteredSuperheroes = superhero_info;
    String.prototype.trim(name);
    String.prototype.trim(race);
    String.prototype.trim(power);
    String.prototype.trim(publisher);

    if (name) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => hero['name'].toLowerCase().includes(name.toLowerCase()));
    }

    if (race) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => hero['Race'].toLowerCase().includes(race.toLowerCase()));
    }

    if (publisher) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => hero['Publisher'].toLowerCase() === publisher.toLowerCase());
    }

    let results = filteredSuperheroes.map(hero => {
        const matchingPower = superhero_powers.find(e => e.hero_names === hero.name);

        if (matchingPower) {
            return { ...hero, powers: matchingPower };
        } else {
            return hero;
        }
    });

    if (power) {
        const matchingPowerNames = superhero_powers
            .filter(hero => hero[power] === "True")
            .map(hero => hero.hero_names);

        results = results.filter(hero =>
            matchingPowerNames.includes(hero.name)
        );
    }

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).send('No matching superheroes found.');
    }
});

app.get('/dcmacomplaintall', (req,res) =>
{
    res.json(complaints);
});

//Adding to the complaints
app.post('/dcmacomplaint', (req,res) =>{
    const requestID = req.body['id'];
    const dateRequestReceived = req.body['date'];
    const dateNoticeSent = '';
    const dateDisputeReceived = '';
    const notes = req.body['note'];
    const status = 'Active'

    let complaint=
    {
    "requestID": requestID,
    "dateRequestReceived": dateRequestReceived,
    "dateNoticeSent": dateNoticeSent,
    "dateDisputeReceived": dateDisputeReceived,
    "notes": notes,
    "status":status
    }

    complaints.push(complaint);
    fs.writeFile("complaints.json", JSON.stringify(complaints), 'utf8', (err) => {
        if (err) {
            res.status(500).send("Error writing data.");
        } else {
            res.status(201).send("Success writing the data");
        }
    });
});

// Updating via the admin
app.post('/dcmacomplaintadmin', (req,res) =>{
    const requestID = req.body['id'];
    const dateNoticeSent = req.body['notice']
    const dateDisputeReceived = req.body['dispute'];
    const status = req.body['status'];
    console.log(requestID);
    console.log(dateNoticeSent);
    console.log(dateDisputeReceived);
    console.log(status);

    const complaintIndex = complaints.findIndex(complaint => complaint['requestID'] === requestID);
    complaints[complaintIndex]={
        ...complaints[complaintIndex],
        "dateNoticeSent":dateNoticeSent,
        "dateDisputeReceived":dateDisputeReceived,
        "status":status,
    }

    fs.writeFile("complaints.json", JSON.stringify(complaints), 'utf8', (err) => {
        if (err) {
            res.status(500).send("Error writing data.");
        } else {
            res.status(201).send("Success writing the data");
        }
    });
});

// Getting all eligable admins.
app.get('/admin', (req,res) =>{
    res.json(adminAccounts);
});

app.post('/admin/:email', (req,res)=>{
    let email = req.params.email;
    let addition =
    {
        "email":email
    }
    adminAccounts.push(addition)

fs.writeFile("admins.json", JSON.stringify(adminAccounts), 'utf8', (err) => {
   if (err) {
       res.status(500).send("Error writing data.");
   } else {
       res.status(201).send("Success writing the data");
   }
});
})

app.post('/deactivateUser', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, { disabled: true });
        res.send(`User with email ${email} has been deactivated`);
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/reactivateUser', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await admin.auth().getUserByEmail(email);
      if (user.disabled) {
        await admin.auth().updateUser(user.uid, { disabled: false });
        res.send(`User with email ${email} has been re-enabled`);
      } 
      else {
        res.status(400).send(`User with email ${email} is not disabled`);
      }
    } catch (error) {
      console.error('Error re-enabling user:', error);
      res.status(500).send('Internal server error');
    }
  });