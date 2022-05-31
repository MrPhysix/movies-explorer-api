const jwt = require('jsonwebtoken');
const { JWT_SECRET_DEV } = require('./const');
//
const { NODE_ENV, JWT_SECRET } = process.env;
const KEY = NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV;

function signToken(user) {
  return jwt.sign(
    { _id: user._id },
    KEY,
    { expiresIn: '7d' },
  );
}

function verifyToken(token) {
  return jwt.verify(token, KEY);
}

module.exports = {
  signToken,
  verifyToken,
};
