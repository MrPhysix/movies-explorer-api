const { celebrate, Joi } = require('celebrate');
const { signUp, signIn } = require('../controllers/users');

function connectSignRoutes(app) {
  app.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }), signUp);

  app.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }), signIn);
}

module.exports = connectSignRoutes;
