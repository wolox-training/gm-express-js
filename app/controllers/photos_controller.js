'use strict';

const photoServices = require('../services/photos'),
  errors = require('../errors');

exports.getPhotosAlbum = (req, res, next) => {
  const albumId = req.params.id;

  return photoServices
    .getPhotos(albumId)
    .then(photos => {
      res.status(200);
      res.send(photos);
    })
    .catch(next);
};
