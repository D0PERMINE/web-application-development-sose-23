let MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://127.0.0.1:27017/";
MongoClient.connect( url, {useUnifiedTopology: true}, 
    function (err, client) { 
        if(err) throw err; 
        console.log("Connected");
        let db = client.db("testDB");
        let myobj = {userId: "maxime", password: "maxime", firstName: "Maxime", lastName: "Muster", role: "non-admin"};
        db.collection("users").insertOne( myobj, 
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
