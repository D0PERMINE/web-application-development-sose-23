let MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://127.0.0.1:27017/";
MongoClient.connect( url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) throw err; 
        console.log("Connected");
        let db = client.db("web-app-dev-database");

        // add users
        let user_1 = {userId: "admina", password: "admina", role: "admin"};
        let user_2 = {userId: "normalo", password: "normalo", role: "non-admin"};
        let myUsers = [user_1, user_2];
        db.collection("users").insertMany( myUsers, 
            function(err, result) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });

        // add locations
        let location_1 = {name:"Wilhelminenhofstraße", description:"Fahrradweg geht nur in eine Richtung und bricht abrupt ab", street:"Wilhelminenhofstraße 76", postalCode:"12459", city:"Berlin", district:"Schöneweide", lat:"52.457776", long:"13.527499"};
        let location_2 = {name:"Goethestraße", description:"Backsteinpflaster und Autos die auf beiden Seiten parken behindern Fahrradmobilität", street:"Goethestraße 55", postalCode:"12459", city:"Berlin", district:"Schöneweide", lat:"52.462778", long:"13.516392"};
        let location_3 = {name:"Herzbergstraße", description:"Auf der Herzbergstraße teilen sich Radfahrende, Autos und die Tram den begrenzten Raum. Weil der Straßenrand als Parkfläche genutzt wird, fahren Radfahrende bislang zwischen parkenden Autos und den Schienen, was Unfallgefahren birgt und zudem den Tramverkehr ausbremst.", street:"Herzbergstraße 126", postalCode:"10365", city:"Berlin", district:"Lichtenberg", lat:"52.526482", long:"13.493836"};

        let myLocations = [location_1, location_2, location_3];

        db.collection("locations").insertMany( myLocations, 
            function(err, result) {
                if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });
});
/*
//FIND ALL       
        db.collection("users").find({}).toArray(
            function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
        });
*/

/*
//FIND ONE
        db.collection("users").findOne({userId: 'admina'}, 
            function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
        });
        
*/

/*
//INSERT ONE  
        let myobj = {userId: "maxime", password: "maxime", firstName: "Maxime", lastName: "Muster", role: "non-admin"};
        db.collection("users").insertOne(myobj, 
            function(err, result) {
                if (err) throw err;
                console.log("1 document inserted");
                console.log(result);
                client.close();
            });
*/

/*
//INSERT MANY
        let myobjs = [{userId: "maxime", password: "maxime",firstName: "Maxime", lastName: "Muster", role: "non-admin"},
             {userId: "max", password: "max",firstName: "Max", lastName: "Mustermann", role: "non-admin"}];
        db.collection("users").insertMany(myobjs, 
            function(err, result) {
                if (err) throw err;
                client.close();
            });
*/

/*
//UPDATE ONE
        const query = {userId: 'max'};
        let replacement = {userId: "max", password: "maxime", firstName: "Maxim", lastName: "Muster", role: "non-admin"};
        db.collection("users").replaceOne(query, replacement, 
            function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
            });
*/

/*
//DELETE ONE
        db.collection("users").deleteOne({firstName: 'Maxime'}, 
            function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
            });      
*/

/*
//DELETE MANY
        db.collection("users").deleteMany({firstName: 'Maxime'}, 
            function(err, result) {
                if (err) throw err;
                console.log(result);
                client.close();
            });
*/
