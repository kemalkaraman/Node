const password = require("passport");
var Kullanici = require("../models/Users");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const session = require("express-session");

module.exports.AdminGet = function(req, res) {
  Kullanici.find(function(err, results) {
 
    if (req.isAuthenticated()  ) {  
      if(req.session.isAdmin){
        res.render("AdminPage", { kullanicilar: results, layout: "layoutAdmin" });
      }  
      else{
          res.render('LoginUser')
      } 
    
  }
  else{      
      res.redirect('/')
  }
  });

  
};

module.exports.KullaniciGet = function(req, res) {
  Kullanici.find({'Active':true},function(err, results) {
    res.render("AdminKullanicilar", {
      kullanicilar: results,
      layout: "layoutAdmin"
    });
  });
};
module.exports.KullaniciPost = function(req, res) {
  if (req.body.day > 0) {
    var day = req.body.day + 1;
    var d = new Date();
    d.setDate(d.getDate() - req.body.day);
 
    Kullanici.find({'Active' :true, ActiveDate: { $gte: d } }, function(rer, results) {
      if (results) {
        res.render("AdminKullanicilar", {
          kullanicilar: results,
          layout: "layoutAdmin"
        });
      } else {
        res.render("AdminKullanicilar", {
          kullanicilar: results,
          layout: "layoutAdmin"
        });
      }
    });
  } else {
    res.render("AdminKullanicilar", {
      kullanicilar: "",
      layout: "layoutAdmin"
    });
  }
};
module.exports.PasifKullaniciGet = function(req, res) {
  Kullanici.find({'Active':false},function(err, results) {
    res.render("AdminPasifKullanicilar", {
      kullanicilar: results,
      layout: "layoutAdmin"
    });
  });
};
module.exports.PasifKullaniciPost = function(req, res) {
  if (req.body.day > 0) {
    var day = req.body.day + 1;
    var d = new Date();
    d.setDate(d.getDate() - req.body.day);
  
    Kullanici.find({'Active' :false,SecretTokenDate: { $gte: d } }, function(rer, results) {
      if (results) {
        res.render("AdminPasifKullanicilar", {
          kullanicilar: results,
          layout: "layoutAdmin"
        });
      } else {
        res.render("AdminPasifKullanicilar", {
          kullanicilar: results,
          layout: "layoutAdmin"
        });
      }
    });
  } else {
    res.render("AdminPasifKullanicilar", {
      kullanicilar: results,
      layout: "layoutAdmin"
    });
  }
};
