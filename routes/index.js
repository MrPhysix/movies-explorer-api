const userRouter = require('./users');
const movieRouter = require('./movies');

function connectRoutes(app) {
  app.use('/users', userRouter);
  app.use('/movies', movieRouter);
}

module.exports = connectRoutes;
