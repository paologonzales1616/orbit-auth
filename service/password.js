const bcrypt = require("bcrypt");

//generate hash password
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

//check if password is valid
function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  generateHash,
  validatePassword
};
