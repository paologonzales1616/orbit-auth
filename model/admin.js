const mongoose = require("mongoose");

//define then schema for admin model
const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  created_date: { type: Date, default: Date.now() },
  updated_date: { type: Date, default: Date.now() },
  updated_password: { type: Boolean, default: false }
});

//create the model for users and export
module.exports = mongoose.model("admin", adminSchema);
