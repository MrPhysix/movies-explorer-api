const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//
const LoginError = require('../errors/LoginError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (data) => validator.isEmail(data),
        message: 'Некоректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function func(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new LoginError('Login error');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new LoginError('Login error: [password]');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
