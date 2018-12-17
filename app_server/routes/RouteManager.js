var routeLogin = require('./LoginRoute');
var routeSignup = require('./SignupRoute');
var routeVerify = require('./VerifyRoute');
var routeHome= require('./HomeRouter');
var routeAdmin= require('./AdminRoute');

module.exports = function (app) {
    app.use('/Admin', routeAdmin);
     app.use('/Login', routeLogin); 
    app.use('/Signup', routeSignup);
    app.use('/Verify', routeVerify);
    app.use('/', routeHome);
   
}
 
  
  