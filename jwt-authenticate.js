const jwt = require("jsonwebtoken");
const {
  accessTokenSecret,
  accessTokenExpiresInMinutes,
  refreshTokenSecret,
  refreshTokenExpiresInMinutes,
} = require("./config.json");

function generateAccessToken(userId) {
  return jwt.sign({ sub: userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiresInMinutes + "m",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ sub: userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresInMinutes + "m",
  });
}

function decodeRefreshToken(token) {
  return jwt.verify(token, refreshTokenSecret);
}

function isAuthenticated(req) {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    jwt.verify(token, accessTokenSecret);
  } catch (err) {
    return false;
  }

  return true;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
  isAuthenticated,
};
