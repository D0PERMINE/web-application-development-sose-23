let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({ users: "bob"});
  //res.send('respond with a resource');
});

// wird aufgerufen bei 
// POST http://localhost:3000/users 
// mit payload {"username":"admina", "password":"1234pwd"}

router.post('/', function(req, res) {
  let userToLogin = req.body;
  if (userToLogin.username === "admina") {
    let mina = { userId: userToLogin.username, name: "Mina", role: "admin"};
    res.status(200).json(mina);
  } else if (userToLogin.username === "normalo") {
    let norm = { userId: userToLogin.username, name: "Norm", role: "non-admin"};
    res.status(200).json(norm);
  } else {
    res.status(401).send("Bad Login Credentials");
  }
});

module.exports = router;
