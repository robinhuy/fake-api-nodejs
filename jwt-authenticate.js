const jwt = require('jsonwebtoken');
const {jwtSecret, jwtTokenexpiresInMinutes} = require('./config.json');

function generateJwtToken(userId) {
  return jwt.sign({sub: userId}, jwtSecret, {
    expiresIn: jwtTokenexpiresInMinutes + 'm',
  });
}

function isAuthenticated(req) {
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    jwt.verify(token, jwtSecret);
  } catch (err) {
    return false;
  }

  return true;
}

module.exports = {
  generateJwtToken,
  isAuthenticated,
};
