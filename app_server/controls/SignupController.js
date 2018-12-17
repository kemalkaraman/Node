var path = require("path");
var Kullanici = require("../models/Users");
const Joi = require("joi");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
var moment = require("moment");

const schema = Joi.object().keys({
  Name: Joi.string()
    .min(1)
    .max(30)
    .required(),
  Surname: Joi.string()
    .min(1)
    .max(60)
    .required(),
  Password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  confirmationPassword: Joi.any()
    .valid(Joi.ref("Password"))
    .required(),
  Email: Joi.string()
    .email()
    .required()
});

module.exports.SignupGet = function(req, res) {
  res.render("Signup");
};
module.exports.SignupPost = function(req, res, next) {
  try {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.render("Signup", {
        errormessage: result.error.details[0].message
      });
      return;
    }
    Kullanici.findOne({ Email: req.body.Email }, function(err, user) {
      if (err) {
      }
      if (user) {
        res.render("Signup", {
          errormessage: "Email is already in use"
        });
      } else {
        var Mail =  req.body.Email;
        const secretToken = randomstring.generate();
        result.value.SecretToken = secretToken;
        result.value.SecretTokenDate=moment(Date.now());
        result.value.CreateDate = moment(Date.now());
        result.value.Active = false; //account is active

        const newUser = new Kullanici(result.value);
        newUser.save(function(err) {
          if (err) {
            console.log("hata", err);
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
                `Hi there, thank you for registerin!  
                <br/>             
                please verify your email by typing following token
                <br/>
                Token: <b>` +
                  secretToken +
                  `</b>            
                On the fallowing page:
                <a href="http://localhost:8000/Verify">http://localhost:8000/Verify</a>
               <br/> `
              };
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                }
              });
            });
            res.render("Signup", {
              successmessage: "kayıt işlemi başarılı  mailiniz kontrol ediniz"
            });
          }
        });
      }
    });
  } catch (error) {}
};
