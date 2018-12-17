const passport = require("passport");
var Kullanici = require("../models/Users");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
var express = require("express");
const session = require('express-session');

module.exports.Logout = function(req, res) {
  req.logout();
  req.session.destroy();
  res.redirect('/');;
};
module.exports.LoginGet = function(req, res) {
  res.render("Login")
};
 module.exports.LoginPost = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.render('Login', { errormessage: info.message })
    }
    req.logIn(user, function(err) {
     req.session.isAdmin = user.isAdmin
     console.log(req.session.isAdmin)
      if (err) { return next(err); }
      return res.redirect('LoginUser')
    });
  })(req, res, next);
};

/*  module.exports.LoginPost = password.authenticate('local', function(req, res, next) {}{
    successRedirect:'LoginUser',
    failureRedirect:'Login',
    failureFlash:true,
  })
   */
module.exports.ForgotPasswordGet = function(req, res) {
  console.log("get");
  res.render("ForgotPassword");
};
module.exports.ForgotPasswordPost = function(req, res) {
  Kullanici.findOne({ Email: req.body.Email }, function(err, user) {
    if (err) {
    }
    if (user) {
      if (user.Active == false) {
        req.flash(
          "error",
          "hesap active edilmemiş ilk önce hesabı aktif ediniz"
        );
        res.render("ForgotPassword");
      } else if (user.Active == true) {
        var Mail =user.Email;
        const secretToken = randomstring.generate();
        user.resetPasswordToken = secretToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          if (err) {
            console.log("hata", err);
          } else {
            nodemailer.createTestAccount((err, account) => {
              let transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                  user: "denemetestmail42@gmail.com", // generated ethereal user
                  pass: "12345sSs!" // generated ethereal password
                },
                tls: {
                  rejectUnauthorized: false
                }
              });
              let mailOptions = {
                from: '"Admin👻" <denemetestmail42@gmail.com>', // sender address
                to: Mail, // list of receivers
                subject: "Hello ✔", // Subject line
                text:
                  "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                  "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                  "http://" +
                  req.headers.host +
                  "/Login/ResetPassword/" +
                  secretToken +
                  "\n\n" +
                  "If you did not request this, please ignore this email and your password will remain unchanged.\n"
              };
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log("mail gönderilemedi ");
                }
                console.log("Message sent: %s", info.messageId);
                console.log(
                  "Preview URL: %s",
                  nodemailer.getTestMessageUrl(info)
                );
              });
            });
            req.flash(
              "success",
              "Şifre değişikliği için activasyon kodu mailine gönderilmiştir"
            );
            res.redirect("ForgotPassword");
          }
        });
      }
    } else {
      req.flash("error", "Bu mail hesabına kayıtlı hesap bulunmamaktadır");
      res.redirect("ForgotPassword");
    }
  });
};
module.exports.ResetPasswordGet = function(req, res) {
  res.render("ResetPassword");
};
module.exports.ResetPasswordPost = function(req, res) {
  Kullanici.findOne(
    {
      resetPasswordToken: req.params.secretToken,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        req.flash(
          "error",
          "Şifre sıfırlama anahtarı geçersiz veya süresi doldu"
        );
        return res.redirect("back");
      }
      if (req.body.password === req.body.confirmpassword) {
        user.Password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          if (err) {
            console.log("hata", err);
          } else {
            req.flash("success", "Şifreniz değiştirildi giriş yapabilirsiniz");
            return res.redirect("/Login");
          }
        });
      } else {
        req.flash("error", "şifreler aynı değil tekrar kontrol edin");
        return res.redirect("back");
      }
    }
  );
};
