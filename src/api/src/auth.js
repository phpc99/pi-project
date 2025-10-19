const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

module.exports = authenticate;
