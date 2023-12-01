const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./json/lab4-17758-firebase-adminsdk-63vkn-b86563f5cc.json');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

// Mongo DB Model
const databaseSchema = new mongoose.Schema({
    'username': {
      type: String,
      required: true,
    },
    'name':{
        type:String,
        required:true
    },
    'notes': {
      type: String,
      required: false,
    },
    'superheroes': {
      type: Array,
      required: true,
    },
    'listPrivacy': {
      type: Boolean,
      required: true,
    },
    'reviews': {
      type: Array,
      required: false,
    },
  });
  
  // Define the model
  const List = mongoose.model('lists', databaseSchema);
    
//Gets all the names of the lists.
app.get('/alllistnames', async (req, res) => {
    try {
        // Find all lists in the database
        const allLists = await List.find({}, 'name');

        // Extract only the names from the result
        const listNames = allLists.map(list => list.name);

        // Send the list names in the response
        res.status(200).json(listNames);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  // Adding a list to MongoDB
  app.post('/listAddition', async (req, res) => {
    try {
        let isPrivate = req.body['visibility'] === 'Private';

        let heroesArray = Array.isArray(req.body['heroes']) ? req.body['heroes'].join(',') : req.body['heroes'];

        heroesArray = heroesArray.trim();
        const superheroNamesArray = heroesArray.split(',');

        let newList = new List({
            'username': req.body['username'],
            'name': req.body['name'],
            'notes': req.body['description'],
            'superheroes': superheroNamesArray,
            'listPrivacy': isPrivate,
            'reviews': [],
        });

        // Save the new list to the database
        const savedList = await newList.save();
        console.log('Added List!')
        res.status(201).json(savedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Deleting the list item
app.delete('/deletelist/:name', async (req, res) => {
    try {
        const listName = req.params.name;

        // Check if a list with the given name exists
        const existingList = await List.findOne({ name: listName });

        if (!existingList) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Remove the list from the database
        await List.deleteOne({ name: listName });

        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Editing a list item.
app.post('/updateList/:listName', async (req, res) => {
    try {
        const listName = req.params.listName;
        console.log(listName);
        const existingList = await List.findOne({ name: listName });

        if (!existingList) {
            return res.status(404).json({ error: 'List not found' });
        }

        let isPrivate = req.body['visibility'] === 'Private';
        let heroesArray = Array.isArray(req.body['heroes']) ? req.body['heroes'].join(',') : req.body['heroes'];

        heroesArray = heroesArray.trim();
        const superheroNamesArray = heroesArray.split(',');

        existingList.notes = req.body.description || existingList.notes;
        existingList.superheroes = superheroNamesArray || existingList.superheroes;
        existingList.listPrivacy = isPrivate || existingList.listPrivacy;
        console.log(req.body.description);
        console.log(isPrivate)
        const updatedList = await existingList.save();

        res.status(200).json(updatedList);
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// getting all the public lists with superhero info.
app.get('/allpubliclists', async (req, res) => {
    try {
        const publicLists = await List.find({ listPrivacy: false });

        // Populate superhero information for each list
        const listsWithSuperheroes = await Promise.all(publicLists.map(async (list) => {
            const superheroDetails = await Promise.all(list.superheroes.map(async (superheroName) => {
                const superhero = superhero_info.find(hero => hero.name.toLowerCase() === superheroName.toLowerCase());
                const matchingPower = superhero_powers.find(e => e.hero_names === superheroName);
                
                if (superhero && matchingPower) {
                    return { ...superhero, powers: matchingPower };
                } else {
                    return superhero;
                }
            }));

            return { ...list.toObject(), superheroes: superheroDetails };
        }));

        res.json(listsWithSuperheroes);
    } catch (error) {
        console.error('Error fetching public lists with superhero info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/userlistsHeroes/:email', async (req, res) =>{
    try {
    const publicLists = await List.find({ username: req.params.email });

    // Populate superhero information for each list
    const listsWithSuperheroes = await Promise.all(publicLists.map(async (list) => {
        const superheroDetails = await Promise.all(list.superheroes.map(async (superheroName) => {
            const superhero = superhero_info.find(hero => hero.name.toLowerCase() === superheroName.toLowerCase());
            const matchingPower = superhero_powers.find(e => e.hero_names === superheroName);
            
            if (superhero && matchingPower) {
                return { ...superhero, powers: matchingPower };
            } else {
                return superhero;
            }
        }));

        return { ...list.toObject(), superheroes: superheroDetails };
    }));

    res.json(listsWithSuperheroes);
    } catch (error) {
    console.error('Error fetching public lists with superhero info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}

})

// Example route for fetching user-specific lists
app.get('/userlistsEditable/:email', async (req, res) => {
    try {
      const userEmail = req.params.email;
      console.log(userEmail)
  
      const userLists = await List.find({ username: userEmail });
  
      res.json(userLists);
    } catch (error) {
      console.error('Error fetching user lists:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //Adding a review to a public list.
  app.post('/addReview/:listId', async (req, res) => {
    try {
      const listId = req.params.listId;
      const rating = req.body.rating;
      const comment = req.body.comment;
      const name = req.body.name;
      let hidden = false;
  
      const lists = await List.find();
    
      let allReviews = [];
      lists.forEach((list) => {
        if (list.reviews && list.reviews.length > 0) {
          allReviews = allReviews.concat(list.reviews);
        }
      });
      const id = allReviews.length;
    
      // Find the list by ID
      const list = await List.findById(listId);
  
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
  
      list.reviews.push({ id,name, rating, comment, hidden });
      const updatedList = await list.save();
      res.status(201).json(updatedList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //Getting all reviews for the admin page.
  app.get('/allreviews', async (req, res) => {
    try {
      const lists = await List.find();
  
      let allReviews = [];
      lists.forEach((list) => {
        if (list.reviews && list.reviews.length > 0) {
          const reviewsWithListID = list.reviews.map((review) => ({
            ...review.toObject(), // Convert Mongoose document to plain JavaScript object
            listID: list._id.toString(), // Add the listID to each review
          }));
          allReviews = allReviews.concat(reviewsWithListID);
        }
      });
  
      res.json(allReviews);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      res.status(500).send('Internal Server Error');
    }
  });
    
  // Hiding a review
  app.post('/updatereview/:reviewId', async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
  
      // Find the review by ID
      const reviewToUpdate = await List.findOne({ 'reviews.id': reviewId });
  
      
      if (!reviewToUpdate) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      // Update the hidden status of the review
      reviewToUpdate.reviews.forEach((review) => {
        if (review.id.toString() === reviewId) {
          if(review.hidden == true) {
            review.hidden = false;
          }
          if(review.hidden == false){
            review.hidden = true;
          }
        }
      });
  
      // Save the updated list
      const updatedList = await reviewToUpdate.save();
  
      res.json(updatedList);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


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

    if (name) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero['name'], name));
    }

    if (race) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero['Race'], race));
    }

    if (publisher) {
        filteredSuperheroes = filteredSuperheroes.filter(hero => isMatch(hero['Publisher'], publisher));
    }

    let results = filteredSuperheroes.map(hero => {
        const matchingPower = superhero_powers.find(e => isMatch(e.hero_names, hero.name));

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

//Function to check if almost every character is correct.
function isMatch(value, searchTerm) {
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Check if the lowercased value and search term have the correct order with up to one character difference
    for (let i = 0; i <= lowerCaseValue.length - lowerCaseSearchTerm.length; i++) {
        const substring = lowerCaseValue.substr(i, lowerCaseSearchTerm.length);
        const distance = [...substring].filter((char, index) => char !== lowerCaseSearchTerm[index]).length;

        if (distance <= 1) {
            return true;
        }
    }

    return false;
}

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