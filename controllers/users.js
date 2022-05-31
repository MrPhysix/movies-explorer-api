const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/token');
//
const User = require('../models/user');
// errors
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const LoginError = require('../errors/LoginError');
const RegisteredEmailError = require('../errors/RegisteredEmailError');

async function getCurrentUser(req, res, next) {
  console.log(req.user);

  try {
    const user = await User.findById(req.user._id);
    if (!user) next(new NotFoundError('Пользователь не найден'));

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

async function setCurrentUser(req, res, next) {
  const { email, password, name } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, password, name },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) next(new NotFoundError('Пользователь не найден'));

    res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') next(new ValidationError('Невалидные данные'));
    if (err.code === 11000) next(new RegisteredEmailError('Указанный Email пренадлежит другому пользователю'));
    else next(err);
  }
}

async function signUp(req, res, next) {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name,
    });
    res.status(200).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    });
  } catch (err) {
    if (err.code === 11000) next(new RegisteredEmailError('Указанный Email уже зарегистрирован'));
    else if (err.name === 'ValidationError') next(new ValidationError(err.message));
    else next(err);
  }
}

async function signIn(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) next(new LoginError('Пользователь не найден'));

    const token = signToken(user);
    if (!token) next(new LoginError('Пользователь не найден [token]'));

    req.headers.Authorization = token;
    console.log('headers Authorization');
    console.log(req.headers.Authorization);
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    });
    res.status(200).send({ token });
  } catch (err) {
    if (err.name === 'LoginError') next(new LoginError('Неверный email или пароль'));
    else next(err);
  }
}

function signOut(req, res, next) {
  const user = req.user._id;

  try {
    res.status(200).clearCookie('jwt').send({ message: `User [${user}] logged out` });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCurrentUser,
  setCurrentUser,
  signUp,
  signIn,
  signOut,
};
