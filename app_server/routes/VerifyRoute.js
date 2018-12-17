var express = require('express');
var router = express.Router();
var controllerVerify = require('../controls/VerifyController');

router.get('/',controllerVerify.VerifyGet);
router.post('/',controllerVerify.VerifyPost);

module.exports = router;
