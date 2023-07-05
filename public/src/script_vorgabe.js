window.addEventListener( "load", function () {
  
  // alt
//   function sendReq() {
//     let httpRequest=new XMLHttpRequest();
//     let url="http://localhost:3000/users"
//     httpRequest.open("POST", url, true);
//     httpRequest.setRequestHeader("Content-Type", "application/json");
    
//     httpRequest.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
//         console.log("Connecting to server with " + url + " failed!\n");
//     };
    
//     httpRequest.onload = function(e) {
//         if (this.status == 200) {
//           let data = this.response;
//           let obj = JSON.parse(data);
//             console.log(obj);
//             alert("localhost:3000/users responded:\n" 
//             + obj.userId + ", " + obj.name + ", " + obj.role);
//         }
//         else {     //Handhabung von nicht-200er
//             alert ("HTTP-status code was: " + this.status);
//         }
//     };
//    // das Objekt mina ist hier hard codiert, das muss geändert werden
//    // "admina" durch User Input für "Username" und 
//    // "1234pwd" durch User-Input für "Password" ersetzen
//     let mina = {username: "admina", password:"1234pwd"};
//     httpRequest.send(JSON.stringify(mina));
// }

// neu
function sendReqPost() {
  let httpRequest=new XMLHttpRequest();
  let url="http://localhost:3000/users"
  httpRequest.open("POST", url, true);
  httpRequest.setRequestHeader("Content-Type", "application/json");
  
  httpRequest.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
      console.log("Connecting to server with " + url + " failed!\n");
  };
  
  httpRequest.onload = function(e) {
      if (this.status == 200) {
        let data = this.response;
        let obj = JSON.parse(data);
          console.log(obj);
          alert("localhost:3000/users responded:\n" 
          + obj.userId + ", " + obj.name + ", " + obj.role);
      }
      else {     //Handhabung von nicht-200er
          alert ("HTTP-status code was: " + this.status);
      }
  };
 // das Objekt mina ist hier hard codiert, das muss geändert werden
 // "admina" durch User Input für "Username" und 
 // "1234pwd" durch User-Input für "Password" ersetzen
  let mina = {username: "admina", password:"1234pwd"};
  httpRequest.send(JSON.stringify(mina));
}

  function sendReqGet() {
    let httpRequest = new XMLHttpRequest();
    let url = "http://localhost:3000/users"
    
    httpRequest.open("GET", url, true);
    
    httpRequest.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
        console.log("Connecting to server with " + url + " failed!\n");
    };
    
    httpRequest.onload = function(e) {
        // diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
        e.preventDefault();
        let data = this.response;
        let obj = JSON.parse(data);

        if (this.status == 200) {
            console.log(this);
            console.log(obj);
            alert("read username successful:\n" 
            + "username: " + obj.userId  
            + "role: " + obj.role);
        }
        else {     //Handhabung von nicht-200er
            console.log ("HTTP-status code was: " + obj.status);
        }
    };
    
    httpRequest.send();
}
  // Access the form element...
  const form = document.getElementById( "myForm" );

  // take over its submit event.
  form.addEventListener( "submit", function ( event ) {
    event.preventDefault();
    sendReq();
  } );
} );





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
            let db = client.db("web-app-dev-database");
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



function sendReqGet() {
  let httpRequest = new XMLHttpRequest();
  let url = "http://localhost:3000/users"
  
  httpRequest.open("GET", url, true);
  
  httpRequest.onerror = function() {// diese Funktion wird ausgefuehrt, wenn ein Fehler auftritt
      console.log("Connecting to server with " + url + " failed!\n");
  };
  
httpRequest.onload = function(e) {
    // diese Funktion wird ausgefuehrt, wenn die Anfrage erfolgreich war
    e.preventDefault();
    let data = this.response;
    let obj = JSON.parse(data);

    if (this.status == 200) {
        console.log(this);
        console.log(obj);
        alert("read username successful:\n" 
        + "username: " + obj.userId  
        + "role: " + obj.role);
    }
    else {     //Handhabung von nicht-200er
        console.log ("HTTP-status code was: " + obj.status);
    }
};

httpRequest.send();

}