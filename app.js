require('dotenv').config();
// const
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// parsers
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  errors,
  celebrate, Joi,
} = require('celebrate');
// db
const DB_URL = 'mongodb://localhost:27017/bitfilmsdb';
const { PORT = 3000 } = process.env;
// errors
const NotFoundError = require('./errors/NotFoundError');
// logs
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
// routes
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { signUp, signIn } = require('./controllers/users');
const auth = require('./middlewares/auth');
// app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
// auth
app.post('/sign-up', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), signUp);

app.post('/sign-in', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signIn);

app.use(cookieParser());
app.use(auth);
//
app.use('/users', userRouter);
app.use('/movies', movieRouter);

// errors handlers
app.use(errorLogger);
app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError(`Путь ${req.method} запроса ${req.path} не найден `));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `Произошла ошибка сервера — ${err}`
      : message,
  });
  next();
});
(async function start() {
  try {
    await mongoose.connect(DB_URL);
    console.log(`Connected to Mongo! Database name: ${mongoose.connections[0].name}`);

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}());
