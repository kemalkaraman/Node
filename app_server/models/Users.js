var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var KullaniciSchema = new Schema(
  {
    Name: String,
    Surname: String,
    Password: String,
    isAdmin :false,
    Email: String,
    Active:Boolean,
    SecretToken:String,
    SecretTokenDate:Date,
    CreateDate:Date,
    ActiveDate:Date,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    isAdmin:{ type: Boolean, default: false },

  },
  { collection: "Users" }
);

var Kullanici = mongoose.model("Users", KullaniciSchema);
module.exports = Kullanici;
