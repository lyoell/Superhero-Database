const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const fs = require('fs');
const superhero_info = JSON.parse(fs.readFileSync("superhero_info.json"));
const superhero_powers = JSON.parse(fs.readFileSync("superhero_powers.json"));
const policy = JSON.parse(fs.readFileSync("policy.json"));
const complaints = JSON.parse(fs.readFileSync("complaints.json"));
const admin = JSON.parse(fs.readFileSync("admins.json"));
app.use(cors());


app.use(express.json());
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
    console.log(name)
    console.log(race)
    console.log(power)
    console.log(publisher)

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
    let results =[]
    if (power) {
        const matchingPowerNames = superhero_powers
            .filter(hero => hero[power] === "True")
            .map(hero => hero.hero_names);

        filteredSuperheroes = filteredSuperheroes.filter(hero =>
            matchingPowerNames.includes(hero.name)
        );
    }

    // const heroNames = filteredSuperheroes.map(hero => hero.name);

    // const matchingPowers = superhero_powers.filter(powerHero => heroNames.includes(powerHero.hero_names));

    // results = filteredSuperheroes.map(hero => {
    //     const matchingPower = matchingPowers.find(e => e.hero_names === hero.name);
    //     return { ...hero, powers: matchingPower };
    // });

    if (filteredSuperheroes.length > 0) {
        res.json(filteredSuperheroes);
    } 
    else {
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
    res.json(admin);
});

app.post('/admin/:email', (req,res)=>{
    let email = req.params.email;
    let addition =
    {
        "email":email
    }
admin.push(addition)

fs.writeFile("admins.json", JSON.stringify(admin), 'utf8', (err) => {
   if (err) {
       res.status(500).send("Error writing data.");
   } else {
       res.status(201).send("Success writing the data");
   }
});
})

//

//Need to change to using mongo here.
// Part 5 & 6
// app.post('/list/add', (req, res) => {
//     const listName = req.body.listName;
//     const superheroIDList = req.body.superheroIDs;
//     const newList = superheroList.findIndex(function (slist) {
//         return slist.n === listName;
//     });

//     // If the list already exists, throw an error and replace the items with the new items.
//     if (newList !== -1) {
//         const duplicateItem = superheroList.findIndex(function (slist) {
//             return slist.n === listName;
//         });
//         superheroList[duplicateItem] = {
//             n: listName,
//             s: superheroIDList
//         }
//         // Write the updated data to the JSON file
//     fs.writeFile("list.json", JSON.stringify(superheroList), 'utf8', (err) => {
//         if (err) {
//             res.status(500).send("Error writing data.");
//         } else {
//             res.status(201).send("This list name already exists. Changing list to include new objects");
//         }
//     });

//     } else {
//         const listObject = {
//             n: listName,
//             s: superheroIDList
//         };
//         superheroList.push(listObject);
//         // Write the updated data to the JSON file
//     fs.writeFile("list.json", JSON.stringify(superheroList), 'utf8', (err) => {
//         if (err) {
//             res.status(500).send("Error writing data.");
//         } else {
//             res.status(201).json(superheroList);
//         }
//     });

//     }
    
// });

// // Part 7
// app.get('/list/return/:name',(req,res) => {
//     const listName = req.params.name;
//     const list = superheroList.find(p => p.n === listName)
//     if(list){
//         res.send(list);
//     }
//     else{
//         res.status(404).send('Item not found');
//     }
// })
// // Part 8
// app.delete('/list/delete/:name', (req,res)=> {
//     const name = req.params.name;
//      const indexToDelete = superheroList.findIndex(p => p.n === name);
//      if (indexToDelete !== -1) {
//         superheroList.splice(indexToDelete, 1);
//          fs.writeFile("list.json", JSON.stringify(superheroList), 'utf8', (err) => {
//             if (err) {
//                 res.status(500).send("Error writing data.");
//             } else {
//                 res.status(201).send("Success deleting the data");
//             }
//         });
//      }
//      else{
//         res.status(404).send('Item not found')
//      }
// });
// // Part 9
// //Get names, info, powers of all superheroes in a list.
// app.get('/list/returnAllInfo/:name',(req,res) => {
//     //Get name of list
//     const listName = req.params.name;
//     let finalList = []
//     //Get list in const list
//     const list = superheroList.find(p => p.n === listName)
//     if(list){
//         const IDs= list.s;
//         //Individually search through each index of the list to find the superhero + name.
//         for(const number in IDs){
//             const superhero = superhero_info.find(p => p.id === parseInt(IDs[number]))
//             const powers = superhero_powers.find(hero => hero.hero_names === superhero["name"])
//             let tempList = {
//                 "info": superhero,
//                 "powers": powers
//             };
//             finalList.push(tempList);
//         }
//     }
//     if(finalList.length!=0){
//         res.send(finalList);
//     }
//     else{
//         res.status(404).send('Item not found');
//     }
// })



