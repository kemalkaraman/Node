var express = require("express");
var router = express.Router();
var ctrlHome = require("../controls/HomeController");
router.get("/", ctrlHome.HomeGet);
router.get("/LoginUser", ctrlHome.LoginUser);




module.exports = router;
