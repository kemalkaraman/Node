var http = require("http");

var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require("fs");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport =require('passport');
var ConnectRoles = require('connect-roles');
require('./app_server/controls/passport')

var path = require("path");
var expressLayouts = require("express-ejs-layouts"); //layut page
app.use(expressLayouts);

app.use("/public", express.static(path.join(__dirname, "public"))); //klsörü kullanıma açma

var db = require("./app_server/models/db"); // veri tabanı bağlantısı için

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/app_server/views"));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req,res,next) =>{
  res.locals.successmessage =req.flash('success')
  res.locals.errormessage =req.flash('error')
  res.locals.isAuthenticated = req.user ? true:false
  next();
});

var dayonline =0; //24 için ziyaret eden kullanıcılar
var count = 0;
var $ipsConnected = [];
var $ipsConnectedday = [];
var d = new Date();
io.on('connection', function (socket) {
 
  var $ipAddress = socket.handshake.address;
  if (!$ipsConnected.hasOwnProperty($ipAddress)) {//önceden bağlanmadı ise ip adresine
    $ipsConnected[$ipAddress] = 1;   
    var hour = d.getHours();
    var minute = d.getMinutes(); 
    var second = d.getSeconds();
    if(hour==23 & minute==59 & second==59){  //gün sonunda sıfırlanıyor  günlük ziyaretçi
      dayonline =0;
      $ipsConnectedday = [];
    }

    if (!$ipsConnectedday.hasOwnProperty($ipAddress)) {//ziyaretçi çıksa bile günlük verileri tutuluyor
      dayonline++; 
      $ipsConnectedday[$ipAddress] = 1; 
   
   }
  	count++;
  	socket.emit('counter', {count:count,counterday:dayonline});
  } 
  socket.on('disconnect', function() {    //dizi içerisinden çıkarılıyor online kullanıcı sayısı için
  	if ($ipsConnected.hasOwnProperty($ipAddress)) {
  		delete $ipsConnected[$ipAddress];
	    count--;
      socket.emit('counter', {count:count});
  	}
  });
});
require("./app_server/routes/RouteManager")(app); //yönlendiriciler yükleniyor \\\!!!!!!!!!!!!!!!!!!
server.listen(8000);
