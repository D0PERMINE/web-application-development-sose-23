const express = require('express'); 
const app = express(); 
const port = 3000; 

// For requests with JSON-payloads, in order to handle them
// use express.json()
app.use(express.json());

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://127.0.0.1:27017/";

async function getUserFromDB(username, password) {

    const client = await MongoClient.connect(url, {useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        console.log("No connection to DB");
        throw "No connection to DB";
    }

    try {
        const db = client.db("locations");
        let collection = db.collection("users");
        let query = {userId: username, password: password};
        let result = await collection.findOne(query);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

async function getAllUsersFromDB() {
    const client = await MongoClient.connect(url, {useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        console.log("No connection to DB");
        throw "No connection to DB ";
    }

    try {
        const db = client.db("locations");
        let collection = db.collection("users");
        let result = await collection.find({}).toArray();
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

// This is used for POST http://localhost:8080/users with payload '{"userId":"normalo", "password":"pass1234"}'
// must send HEADER "Content-Type: application/json !!""
app.post("/users", async (req, res) => {
    try {
      let userToLogin = req.body;
      console.log("Received: ", userToLogin);
      const user = await getUserFromDB(userToLogin.userId, userToLogin.password);
      if (user != undefined && user != null) {
        delete user.password; 
        res.status(200).send(user);
      } else {
        res.status(401).send("Not authorized");
      }
    } catch (err) {
        console.log("Something went wrong", err);
        res.status(500).send("Something went wrong");
    }
});

// with async/await 
app.get("/users", async (req, res) => { 
    try {
        const users = await getAllUsersFromDB();
        res.status(200).send(users);
    } catch (err) {
        console.log("Something went wrong", err);
        res.status(500).send("Something went wrong");
    } 
}); 

// Einen Parameter im Pfad als Input-Parameter nutzen
app.get('/loc/:id', async (req, res) => {
    try {
        const idInPath = req.params.id; 
        res.send("Received: " + idInPath);
        //const loc = await getLocFromDb({ id: idInPath })
        //res.json(loc);
    } catch (err) {
        console.log("Something went wrong", err);
        res.status(500).send("Something went wrong");
    }
});
 
app.listen(port, () => { 
    console.log('Example app listening on port ' + port + '!'); 
});



