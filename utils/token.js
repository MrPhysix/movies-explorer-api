const jwt = require('jsonwebtoken');
//
const { NODE_ENV, JWT_SECRET } = process.env;
const KEY = NODE_ENV === 'production' ? JWT_SECRET : 'dev-key';

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
