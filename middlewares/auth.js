require('dotenv').config();
const LoginError = require('../errors/LoginError');
const { verifyToken } = require('../utils/token');
//
module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const token = req.cookies.jwt;

  if (!token) throw new LoginError('Необходима авторизация');

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    next(new LoginError('Необходима авторизация [token]'));
  }
  req.user = payload;
  next();
};
