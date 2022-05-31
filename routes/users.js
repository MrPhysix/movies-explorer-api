const router = require('express').Router();
//
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, setCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), setCurrentUser);

module.exports = router;
