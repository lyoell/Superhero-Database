const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const fs = require('fs');
const superhero_info = JSON.parse(fs.readFileSync("superhero_info.json"));
const superhero_powers = JSON.parse(fs.readFileSync("superhero_powers.json"));
app.use(cors());


app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

//Getting the pattern.
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



