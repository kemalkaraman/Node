var express = require("express");
var router = express.Router();
const passport = require("passport");
var ctrlLogin = require("../controls/LoginController");

router.get("/", ctrlLogin.LoginGet);
router.post("/", ctrlLogin.LoginPost);

router.get("/Logout", ctrlLogin.Logout);

router.get("/ForgotPassword", ctrlLogin.ForgotPasswordGet);
router.post("/ForgotPassword", ctrlLogin.ForgotPasswordPost);

router.get("/ResetPassword/:secretToken", ctrlLogin.ResetPasswordGet);
router.post("/ResetPassword/:secretToken", ctrlLogin.ResetPasswordPost);

module.exports = router;

/* router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("error", "zaten bir hesapla giriş yaptınız");
    res.render("");
  } else {
    res.render("Login");
  }
});
router.post("/", passport.authenticate("local", { session: true }), function(req,res) {
    res.locals.isAuthenticated = req.user ? true:false   
    console.log(req.isAuthenticated())
    console.log(req.user.isAdmin)
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {  
       
        req.flash("success", "giriş yaptınız");
        res.redirect('/Admin');;
  
    } else {
        console.log(req.user.isAdmin)
        req.flash("error", "admin değil");
        res.redirect('/');;
    }
  }

}); */