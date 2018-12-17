var express = require("express");
var router = express.Router();
var ctrlAdmin = require("../controls/AdminController");
router.get("/", ctrlAdmin.AdminGet);
router.get("/Kullanicilar", ctrlAdmin.KullaniciGet);
router.post("/Kullanicilar", ctrlAdmin.KullaniciPost);
router.get("/PasifKullanicilar", ctrlAdmin.PasifKullaniciGet);
router.post("/PasifKullanicilar", ctrlAdmin.PasifKullaniciPost);

module.exports = router;


