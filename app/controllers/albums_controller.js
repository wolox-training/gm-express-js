'use strict';

const validationResult = require('express-validator/check').validationResult,
  albumServices = require('../services/albums'),
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

exports.create = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

  const externalAlbum = {
    externalId: req.body.externalId,
    userId: req.params.userId
  };

  return Promise.all([
    albumServices.getOneLocal(externalAlbum),
    albumServices.getOne(externalAlbum.externalId)
  ])
    .then(result => {
      if (!result[0] && result[1]) {
        const newAlbum = {
          externalId: req.body.externalId,
          userId: req.params.userId,
          title: result[1].title
        };

        return albumServices.create(newAlbum).then(album => {
          res.status(200);
          res.send({ boughtAlbum: `User, with ID ${album.userId}, just bought ${album.title}` });
        });
      } else {
        throw errors.badRequest('User ever bought this album');
      }
    })
    .catch(next);
};
