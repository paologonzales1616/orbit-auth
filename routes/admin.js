const router = require("express").Router();
const { validationResult } = require("express-validator");

const { generateHash, validatePassword } = require("../service/password");
const { generateSignedToken } = require("../service/jwt");
const { ADMIN_REGISTER, ADMIN_LOGIN } = require("../service/validate");
const Admin = require("../model/admin");

router.post("/admin/register", ADMIN_REGISTER, (req, res) => {
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

  router.post("/auth/admin", ADMIN_LOGIN, (req, res) => {
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
});

module.exports = router;
