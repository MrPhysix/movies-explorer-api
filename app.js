require('dotenv').config();
// const
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
// parsers
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// utils
const limiter = require('./utils/limiter');
// db
const { NODE_ENV, DB, PORT = 3000 } = process.env;
const DB_URL = NODE_ENV === 'production' ? DB : 'mongodb://localhost:27017/moviesdb';
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
// app
const app = express();
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
// routes
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
