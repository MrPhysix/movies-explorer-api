const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
//
const { getMovies, createMovie, removeMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((data, helper) => {
      if (validator.isURL(data)) {
        return data;
      }
      return helper.message('Некоректный URL');
    }),
    trailerLink: Joi.string().required().custom((data, helper) => {
      if (validator.isURL(data)) {
        return data;
      }
      return helper.message('Некоректный URL');
    }),
    thumbnail: Joi.string().required().custom((data, helper) => {
      if (validator.isURL(data)) {
        return data;
      }
      return helper.message('Некоректный URL');
    }),
    // owner: Joi.object().required().uri(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
