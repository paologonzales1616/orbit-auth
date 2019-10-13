const { check } = require("express-validator");

const ADMIN_LOGIN = [
  check("email")
    .isEmail()
    .withMessage("Must be valid email address.")
    .not()
    .isEmpty()
    .withMessage("Email must not be empty."),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty.")
];

const USER_LOGIN = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username must not be empty."),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty.")
];

const ADMIN_REGISTER = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name must not be empty."),
  check("email")
    .isEmail()
    .withMessage("Must be valid email address.")
    .not()
    .isEmpty()
    .withMessage("Email must not be empty."),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty.")
];

const USER_REGISTER = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name must not be empty."),
  check("username")
    .isLength({ min: 3 })
    .not()
    .isEmpty()
    .withMessage("Username must not be empty."),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password must not be empty.")
];

module.exports = {
  ADMIN_LOGIN,
  USER_LOGIN,
  ADMIN_REGISTER,
  USER_REGISTER
};
