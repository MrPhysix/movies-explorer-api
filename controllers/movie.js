const Movie = require('../models/movie');
// errors
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');
//

async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find({});
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  const owner = req.user._id;

  const {
    country, director,
    duration, year,
    description, image,
    trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') next(new ValidationError('Невалидные данные'));
    else next(err);
  }
}

async function removeMovie(req, res, next) {
  const movieId = req.params._id;
  const userId = req.user._id;

  let movie;
  try {
    movie = await Movie.findById(movieId);
    if (!movie) next(new NotFoundError('Такого фильма нет'));

    const ownerId = movie.owner.toString();
    if (ownerId !== userId) next(new AccessError('Вы не можете удалить чужую страницу фильма'));

    movie = await Movie.findByIdAndRemove(movieId);
    res.status(200).send(movie);
  } catch (err) {
    if (err.kind === 'ObjectId') next(new ValidationError('Невалидный [id]'));
    else next(err);
  }
}

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
