const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var Kullanici = require("../models/Users");

passport.serializeUser((user, done) => {
    
  done(null, user.id);

});

passport.deserializeUser(function(id, done) {
  try {
    const user = Kullanici.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
passport.use('local',new LocalStrategy(  {

      usernameField: 'Email',
      passwordField: 'Password',
      passReqToCallback: false,
    }, async(Email, Password, done) => {
      
        Kullanici.findOne({ 'Email': Email}, function(err, user) {
            
            if (err) {
            }          
            if (user) {
              if (user.Active == false) {
                return done(null,false,{message :'hesap aktif değil mailinizi kontrol ediniz'})
              } else if (user.Active == true) {
                if (user.Password == Password) {  
                  if(user.isAdmin) {
                    console.log("admin")
                    return done(null,user)  //giriş yaptı
                  }   
                  else{
                    return done(null,user)  //giriş yaptı
                  }          
                   
                } else {
                    return done(null,false,{message :'şifre yanlış'})
                }
              }
            } else {
              return done(null,false,{message :'Kullanıcı bulunamadı'})  
            }
          })
    }
  )
);
