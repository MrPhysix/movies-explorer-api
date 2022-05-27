const NotFoundError = require('../errors/NotFoundError');

function pathError(req, res, next) {
  next(new NotFoundError(`Путь ${req.method} запроса ${req.path} не найден `));
}

function serverError(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `Произошла ошибка сервера — ${err}`
      : message,
  });
  next();
}

module.exports = {
  pathError,
  serverError,
};
