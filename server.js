require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const server = express();
const port = parseInt(process.env.PORT, 10) || 3000;
const {
  ADMIN_LOGIN,
  USER_LOGIN,
  ADMIN_REGISTER,
  USER_REGISTER
} = require("./service/validate");

const { generateHash, validatePassword } = require("./service/password");
const { generateSignedToken, verifyToken } = require("./service/jwt");
const Admin = require("./model/admin");
const User = require("./model/user");

server.use(morgan("dev"));
server.use(helmet());
server.use(cors());
server.use(bodyParser.json());

// connect to our database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err =>
    err ? console.error(err) : console.log("Database connection established...")
);

//user login
server.post("/auth", USER_LOGIN, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).jsonp({ status: "fail", message: errors.array() });
    return;
  }
  const { username, password } = req.body;
  User.findOne({ username: username }).exec((err, user) => {
    if (user == null) {
      res
        .status(400)
        .jsonp({ status: "fail", message: "Username or password is invalid." });
      return;
    }
    if (err) {
      res.status(400).jsonp({ status: "fail", message: err.message });
      return;
    }
    if (!validatePassword(password, user.password)) {
      res.status(400).jsonp({ status: "fail", message: "Password Invalid." });
      return;
    }
    res.status(200).jsonp({
      status: "success",
      data: {
        token: generateSignedToken({
          admin_email: user.admin_email,
          name: user.name,
          username: user.username,
          admin: false
        })
      }
    });
    return;
  });
});

//user register
server.post("/auth/register", USER_REGISTER, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).jsonp({ status: "fail", message: errors.array() });
    return;
  }

  if (!req.headers.authorization) {
    res
      .status(400)
      .jsonp({ status: "fail", message: "Authorization Header missing." });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!verifyToken(token)) {
    res.status(400).jsonp({ status: "fail", message: "Token Invalid" });
    return;
  }

  const { admin_email, name, username, password } = req.body;

  User.findOne({ username: username }).exec((err, user) => {
    if (user != null) {
      res
        .status(400)
        .jsonp({ status: "fail", message: "Username already Exist." });
      return;
    }

    if (err) {
      res.status(400).jsonp({ status: "fail", message: err.message });
      return;
    }

    const newUser = new User();
    newUser.admin_email = admin_email;
    newUser.name = name;
    newUser.username = username;
    newUser.password = generateHash(password);
    newUser.save(err => {
      if (err) {
        res.status(400).jsonp({ status: "fail", message: err.message });
        return;
      }
    });

    res.status(200).jsonp({
      status: "success",
      message: "Registration successful."
    });
  });
});

//admin login
server.post("/auth/admin", ADMIN_LOGIN, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).jsonp({ status: "fail", message: errors.array() });
    return;
  }
  const { email, password } = req.body;

  Admin.findOne({ email: email }).exec((err, admin) => {
    if (admin == null) {
      res
        .status(400)
        .jsonp({ status: "fail", message: "Email or password is invalid." });
      return;
    }
    if (err) {
      res.status(400).jsonp({ status: "fail", message: err.message });
      return;
    }
    if (!validatePassword(password, admin.password)) {
      res.status(400).jsonp({ status: "fail", message: "Password Invalid." });
      return;
    }

    res.status(200).jsonp({
      status: "success",
      data: {
        token: generateSignedToken({
          name: admin.name,
          email: admin.email,
          admin: true
        })
      }
    });
    return;
  });
});

//admin register
server.post("/auth/admin/register", ADMIN_REGISTER, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).jsonp({ status: "fail", error: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  Admin.findOne({ email: email }).exec((err, admin) => {
    if (admin != null) {
      res
        .status(400)
        .jsonp({ status: "fail", message: "Email already Exist." });
      return;
    }

    if (err) {
      res.status(400).jsonp({ status: "fail", message: err.message });
      return;
    }

    const newAdmin = new Admin();
    newAdmin.name = name;
    newAdmin.email = email;
    newAdmin.password = generateHash(password);
    newAdmin.save(err => {
      if (err) {
        res.status(400).jsonp({ status: "fail", message: err.message });
        return;
      }
    });
    res.status(200).jsonp({
      status: "success",
      message: "Registration successful."
    });
    return;
  });
});

server.listen(port, () =>
  console.log(`Authentication server running on host: http://localhost:${port}`)
);
