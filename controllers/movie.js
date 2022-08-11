const Movie = require('../models/movie');
// errors
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');
// message
const { ErrorMessage } = require('../utils/const');

async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find({});
    const userMovies = movies.filter(item => item.owner.toString() === req.user._id);
    res.status(200).send(userMovies);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  const owner = req.user._id;

  // const {
  //   country, director,
  //   duration, year,
  //   description, image,
  //   trailerLink, nameRU, nameEN,
  //   thumbnail, movieId,
  // } = req.body;

  try {
    const movie = await Movie.create({ ...req.body, owner });
    res.status(200).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') next(new ValidationError(err));
    else next(err);
  }
}

async function removeMovie(req, res, next) {
  const movieId = req.params._id;
  const userId = req.user._id;

  let movie;
  try {
    movie = await Movie.findById(movieId);
    if (!movie) next(new NotFoundError(`Фильм ${ErrorMessage.NotFound}`));

    const ownerId = movie.owner.toString();
    if (ownerId !== userId) next(new AccessError(`${ErrorMessage.Access}: Вы не можете удалить чужую страницу фильма`));

    movie = await Movie.findByIdAndRemove(movieId);
    res.status(200).send(movie);
  } catch (err) {
    if (err.kind === 'ObjectId') next(new ValidationError(`${ErrorMessage.InvalidData} [id]`));
    else next(err);
  }
}

module.exports = {
  getMovies,
  createMovie,
  removeMovie,
};
