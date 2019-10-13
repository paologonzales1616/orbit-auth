const router = require("express").Router();
const { validationResult } = require("express-validator");

const { generateHash, validatePassword } = require("../service/password");
const { generateSignedToken } = require("../service/jwt");
const { USER_REGISTER, USER_LOGIN } = require("../service/validate");

router.post("/auth", USER_LOGIN, (req, res) => {
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
router.post("/auth/register", USER_REGISTER, (req, res) => {
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

module.exports = router;
