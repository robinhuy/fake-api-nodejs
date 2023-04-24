import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, name: user.firstName + ' ' + user.lastName, avatar: user.avatar },
    CONFIG.accessTokenSecret,
    {
      expiresIn: CONFIG.accessTokenExpiresInMinutes + 'm',
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ sub: user.id }, CONFIG.refreshTokenSecret, {
    expiresIn: CONFIG.refreshTokenExpiresInMinutes + 'm',
  });
};

export const decodeRefreshToken = (token) => {
  return jwt.verify(token, CONFIG.refreshTokenSecret);
};

export const isAuthenticated = (req) => {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    jwt.verify(token, CONFIG.accessTokenSecret);
  } catch (err) {
    return false;
  }

  return true;
};
