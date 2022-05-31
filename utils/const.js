const JWT_SECRET_DEV = 'dev-key';

const ErrorMessage = {
  InvalidData: 'Невалидные данные',
  Authorization: 'Необходима авторизация',
  Access: 'Нет доступа',
  NotFound: 'не найден',
  RegisteredEmail: 'Указанный Email уже зарегистрирован',
  Login: 'Неверный email или пароль',
  URL: 'Некоректный URL',
  Email: 'Некоректный email',
  Server: 'Произошла ошибка сервера',
};

const Response = {
  MongoConnected: 'Connected to Mongo! Database name: ',
  AppListen: 'App listening on port: ',
};

module.exports = {
  JWT_SECRET_DEV,
  ErrorMessage,
  Response,
};
