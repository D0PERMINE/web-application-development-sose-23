// const express = require('express'); 
// const app = express(); 
// const port = 3000; 

// var http = require('http');
// var server = http.createServer(app);

// const MongoClient = require('mongodb').MongoClient; 
// const url = "mongodb://127.0.0.1:27017/";

// app.get("/users", function(req, res) { 

//     MongoClient.connect(url, 
//         function (err, client) { 
//             if(err) { //better error handling needed 
//                  throw err;
//             }             
//             let db = client.db("testDB");
//             db.collection("users").find({}).toArray(
//             function(err, result) {
//                 if (err) { //better error handling needed 
//                  throw err;
//                 }
//                 res.status(200).send(result);
//                 client.close();
//             });
//         }); 
// }); 

// server.listen(port, () => { 
//     console.log('Example app listening on port ' + port + '!'); 
// });




const express = require('express');
const app = express();
app.use(express.static('public'));
const mongodb = require('mongodb');

// Verbinde dich mit der MongoDB-Datenbank
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017'; // Ändere die Verbindungs-URL entsprechend deiner MongoDB-Instanz
const dbName = 'web-app-dev-database'; // Ändere den Datenbanknamen entsprechend deiner MongoDB-Datenbank
let db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.log('Fehler beim Verbinden mit der Datenbank:', err);
    } else {
      console.log('Erfolgreich mit der Datenbank verbunden');
      db = client.db(dbName);
    }
  });

// GET-Endpunkt zum Abrufen aller Benutzereinträge
app.get('/users', (req, res) => {
    // Abrufen aller Benutzereinträge aus der Datenbank
    db.collection('users').find({}).toArray((err, result) => {
      if (err) {
        console.log('Fehler beim Abrufen der Benutzereinträge:', err);
        res.status(500).send('Interner Serverfehler');
      } else {
        res.send(result); // Alle Benutzereinträge als JSON zurückgeben
      }
    });
  });  

  // GET-Endpunkt für die Überprüfung der Login-Daten
app.get('/login', (req, res) => {
    const userId = req.query.userId;
    const password = req.query.password;
  
    // Überprüfe die Login-Daten in der Datenbank
    db.collection('users').findOne({ userId, password }, (err, result) => {
      if (err) {
        console.log('Fehler beim Abrufen der Benutzerdaten:', err);
        res.status(500).send({ success: false, message: 'Interner Serverfehler' });
      } else {
        if (result) {
          res.send({ success: true, message: 'Login erfolgreich' });
        } else {
          res.send({ success: false, message: 'Ungültige Anmeldeinformationen' });
        }
      }
    });
  });

const bodyParser = require('body-parser');

// Middleware für das Parsen von JSON-Daten im Request-Body
app.use(bodyParser.json());

// POST-Endpunkt zum Erstellen eines Eintrags in der "locations"-Collection
app.post('/locations', (req, res) => {
  const locationData = req.body;

  // Füge den Eintrag zur "locations"-Collection hinzu
  db.collection('locations').insertOne(locationData, (err, result) => {
    if (err) {
      console.log('Fehler beim Erstellen des Eintrags:', err);
      res.status(500).send('Interner Serverfehler');
    } else {
      const createdEntryId = result.insertedId; // Erhaltene ID des neu erstellten Eintrags
      res.send({ id: createdEntryId }); // Sendet die ID als JSON zurück
    }
  });
});


// GET-Endpunkt zum Abrufen aller Locations
app.get('/locations', (req, res) => {
    // Abrufen aller Einträge aus der "locations"-Collection
    db.collection('locations').find({}).toArray((err, result) => {
      if (err) {
        console.log('Fehler beim Abrufen der Locations:', err);
        res.status(500).send('Interner Serverfehler');
      } else {
        res.send(result); // Alle Locations als JSON zurückgeben
      }
    });
  });
  

// GET-Endpunkt zum Abrufen eines bestimmten Eintrags aus der "locations"-Collection
app.get('/locations/:id', (req, res) => {
    const id = req.params.id;
  
    // Abrufen des Eintrags anhand der ID
    db.collection('locations').findOne({ _id: mongodb.ObjectID(id) }, (err, result) => {
      if (err) {
        console.log('Fehler beim Abrufen des Eintrags:', err);
        res.status(500).send('Interner Serverfehler');
      } else {
        if (result) {
          res.send(result); // Einzelnen Eintrag als JSON zurückgeben
        } else {
          res.status(404).send('Eintrag nicht gefunden');
        }
      }
    });
  });


// PUT-Endpunkt zum Aktualisieren eines Eintrags in der "locations"-Collection
app.put('/locations/:id', (req, res) => {
    const id = req.params.id;
    const updatedLocationData = req.body;
  
    // Aktualisiere den Eintrag in der "locations"-Collection
    db.collection('locations').updateOne(
      { _id: mongodb.ObjectID(id) },
      { $set: updatedLocationData },
      (err, result) => {
        if (err) {
          console.log('Fehler beim Aktualisieren des Eintrags:', err);
          res.status(500).send('Interner Serverfehler');
        } else {
          if (result.matchedCount > 0) {
            res.send('Eintrag erfolgreich aktualisiert');
          } else {
            res.status(404).send('Eintrag nicht gefunden');
          }
        }
      }
    );
  });

// DELETE-Endpunkt zum Löschen eines Eintrags in der "locations"-Collection
app.delete('/locations/:id', (req, res) => {
  const id = req.params.id;

  // Lösche den Eintrag aus der "locations"-Collection
  db.collection('locations').deleteOne({ _id: mongodb.ObjectID(id) }, (err, result) => {
    if (err) {
      console.log('Fehler beim Löschen des Eintrags:', err);
      res.status(500).send('Interner Serverfehler');
    } else {
      if (result.deletedCount > 0) {
        res.send('Eintrag erfolgreich gelöscht');
      } else {
        res.status(404).send('Eintrag nicht gefunden');
      }
    }
  });
});
  

// Starte den Server
const port = 3000; // Ändere den Port entsprechend deinen Anforderungen
app.listen(port, () => {
  console.log('Der Server ist gestartet und hört auf Port', port);
});
