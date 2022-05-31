const cookieParser = require('cookie-parser');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { signOut } = require('../controllers/users');
const connectSignRoutes = require('./sign');

function connectRoutes(app) {
  connectSignRoutes(app);
  app.use(cookieParser());
  app.use(auth);
  app.post('/logout', signOut);
  app.use('/users', userRouter);
  app.use('/movies', movieRouter);
}

module.exports = connectRoutes;
