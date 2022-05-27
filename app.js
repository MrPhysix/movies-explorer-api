require('dotenv').config();
// const
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
// parsers
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {
  errors,
  celebrate, Joi,
} = require('celebrate');
// utils
const limiter = require('./utils/limiter');
// db
const { NODE_ENV, DB, PORT = 3000 } = process.env;
const DB_URL = NODE_ENV === 'production' ? DB : 'mongodb://localhost:27017/bitfilmsdb';
// errors
const {
  pathError,
  serverError,
} = require('./utils/errorHandler');
// logs
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
// routes
const connectRoutes = require('./routes/index');
const { signUp, signIn, signOut } = require('./controllers/users');
const auth = require('./middlewares/auth');
// app
const app = express();
app.use(helmet());
app.use(limiter);
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
app.post('/sign-out', signOut);
//
connectRoutes(app);
// errors handlers
app.use(errorLogger);
app.use(errors());
app.use(pathError);
app.use(serverError);

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
