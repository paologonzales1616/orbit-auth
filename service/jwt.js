const fs = require("fs");
const jwt = require("jsonwebtoken");
const privateKEY = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
const publicKEY = fs.readFileSync(process.env.PUBLIC_KEY, "utf8");

function generateSignedToken(payload) {
  return jwt.sign(payload, privateKEY, {
    algorithm: "RS256"
  });
}

function verifyToken(token) {
  const verifyOptions = {
    algorithm: ["RS256"]
  };

  try {
    return jwt.verify(token, publicKEY, verifyOptions);
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateSignedToken,
  verifyToken
};
