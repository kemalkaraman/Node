const password = require("passport");
var Kullanici = require("../models/Users");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");


module.exports.HomeGet = function(req, res) {
  res.render("Home");
};


module.exports.LoginUser =  function(req, res) {

    if(req.isAuthenticated()){
        res.render('LoginUser')
    }
    else{
        req.flash('error','Giriş yapmanız gerekiyor')
        res.redirect('/');
    }
   
}


  
   
   
