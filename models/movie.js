const mongoose = require('mongoose');
const validator = require('validator');
const { ErrorMessage } = require('../utils/const');

const { ObjectId } = mongoose.Schema.Types;

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (data) => validator.isURL(data),
        message: ErrorMessage.URL,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (data) => validator.isURL(data),
        message: ErrorMessage.URL,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (data) => validator.isURL(data),
        message: ErrorMessage.URL,
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
