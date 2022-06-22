const LoginError = require('../errors/LoginError');
const { verifyToken } = require('../utils/token');
const { ErrorMessage } = require('../utils/const');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;// - если не получится получить cookie в браузере
  // const token = req.cookies.jwt;

  if (!token) throw new LoginError(ErrorMessage.Authorization);

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    next(new LoginError(`${ErrorMessage.Authorization} [token]`));
  }
  req.user = payload;
  next();
};
