const NotFoundError = require('../errors/NotFoundError');
const { ErrorMessage } = require('./const');

function pathError(req, res, next) {
  next(new NotFoundError(`Путь ${req.method} запроса ${req.path} не найден `));
}

function serverError(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `${ErrorMessage.Server} — ${err}`
      : message,
  });
  next();
}

module.exports = {
  pathError,
  serverError,
};
