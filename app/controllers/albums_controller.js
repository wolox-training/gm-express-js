'use strict';

const albumServices = require('../services/albums'),
  errors = require('../errors');

exports.getAll = (req, res, next) => {
  albumServices
    .getAll()
    .then(albums => {
      res.status(200);
      res.send(albums);
    })
    .catch(next);
};
