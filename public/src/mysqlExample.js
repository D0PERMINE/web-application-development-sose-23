var mysql = require('mysql');

// db.f4.htw-berlin.de existiert nicht mehr
// var conn = mysql.createConnection({
//   host: "db.f4.htw-berlin.de",
//   user: "schueler",
//   password: "",
//   database: "_schueler__adviDB"
// });

//var conn = mysql.createConnection('mysql://schueler:schueler@db.f4.htw-berlin.de/_schueler__adviDB');
conn.connect(function(err) {
  //console.log(err);
  if (err) throw err;
});

conn.query("SELECT * FROM user", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    //console.log(fields);
});

// Terminating the connection
conn.end( function(err) {
    if (err) throw err;
});