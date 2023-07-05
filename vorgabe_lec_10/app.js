const express = require('express'); 
const app = express(); 
const port = 3000; 

const MongoClient = require('mongodb').MongoClient; 
const url = "mongodb://127.0.0.1:27017/";

app.get("/users", function(req, res) { 

    MongoClient.connect(url, 
        function (err, client) { 
            if(err) { //better error handling needed 
                 throw err;
            }             
            let db = client.db("testDB");
            db.collection("users").find({}).toArray(
            function(err, result) {
                if (err) { //better error handling needed 
                 throw err;
                }
                res.status(200).send(result);
                client.close();
            });
        }); 
}); 

app.listen(port, () => { 
    console.log('Example app listening on port ' + port + '!'); 
});



