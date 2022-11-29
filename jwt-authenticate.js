import jwt from "jsonwebtoken";
import config from "./config.json" assert { type: "json" };

export const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiresInMinutes + "m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiresInMinutes + "m",
  });
};

export const decodeRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};

export const isAuthenticated = (req) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    token = req.headers.authorization.split(" ")[1];
  }

  try {
    jwt.verify(token, config.accessTokenSecret);
  } catch (err) {
    return false;
  }

  return true;
};
