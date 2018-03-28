'use strict';

const check = require('express-validator/check').check,
  albumServices = require('../services/albums'),
  validationResult = require('express-validator/check').validationResult,
  errors = require('../errors');

exports.validateAlbum = [check('externalId', 'extranlId must be an int').isInt()];

exports.validateId = [check('id', 'external id for album must be an int').isInt()];

exports.boughtByUser = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

  const albumParams = {
    userId: req.user.id,
    externalId: parseInt(req.params.id)
  };

  return albumServices
    .getOneLocal(albumParams)
    .then(album => {
      if (album) {
        next();
      } else {
        throw errors.badRequest(`User did not bought this album ${parseInt(req.params.id)}`);
      }
    })
    .catch(next);
};
