const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//define then schema for admin model
const userSchema = mongoose.Schema({
  admin_email: String,
  name: String,
  username: String,
  password: String,
  created_date: { type: Date, default: Date.now() },
  updated_date: { type: Date, default: Date.now() },
  updated_password: { type: Boolean, default: false }
});

//Schema methods
//generate hash password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
};

//check if password is valid
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

//create the model for users and export
module.exports = mongoose.model("user", userSchema);
