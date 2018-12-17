var Kullanici = require("../models/Users");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
var moment = require("moment");

module.exports.VerifyGet = function(req, res) {
  res.render("Verify");
};

module.exports.VerifyPost = function(req, res) {
  Kullanici.findOne({ SecretToken: req.body.secretToken }, function(err, user) {
    if (err) {
    }
    
  
    //kullanıcı var
    if (user) {
      var Mail =user.Email
      if ((+user.SecretTokenDate + (24 * 60 * 60 * 1000))  > (moment(Date.now())+0)) {
        //1 günlük token süresi geçmemiş
        user.SecretToken = "";
        user.SecretTokenDate=""; 
        user.Active = true;
        user.ActiveDate = moment(Date.now());
        user.save(function(err) {
          if (err) {
            console.log("hata verify ", err);
          } else {
            req.flash("success", "şimdi giriş yapabilirsiniz");
            res.redirect("Login");
          }
        });
      } else {
        const secretToken =randomstring.generate();
        user.SecretToken = secretToken;
        user.SecretTokenDate =  moment(Date.now());
        user.save(function(err) {
          if (err) {
            console.log("hata verify ", err);
          } else {
            nodemailer.createTestAccount((err, account) => {
              // create reusable transporter object using the default SMTP transport
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
                text: "Hello world?", // plain text body
                html:
                  `Hi there,
                <br/>
                thank you for registerin!
                <br/><br/>
                please verify your email by typing following token
                <br/>
                Token: <b>` +
                  secretToken +
                  `</b>  <br/>
                <br/>
                On the fallowing page:
                <a href="http://localhost:8000/Verify">http://localhost:8000/Verify</a>
               <br/>
                Have a plasent day ! ; `
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
            req.flash("success", "Yeni Token Mailinize gönderildi");
            res.redirect("Verify");
          }
        });
        //tekrar token gönderme işlemi token süresi doldu mailinze tekrar token gönderildi
      }
    } else {
      req.flash("error", "girdiğiniz kod hatalı");
      res.redirect("Verify");
    }
  });
 
};
