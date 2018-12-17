var express = require('express');
var router = express.Router();
var controllerSignup = require('../controls/SignupController');
router.get('/',controllerSignup.SignupGet);
router.post('/',controllerSignup.SignupPost);


module.exports = router;