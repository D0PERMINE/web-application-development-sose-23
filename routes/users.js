let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({ users: "bob"});
  //res.send('respond with a resource');
});

module.exports = router;
