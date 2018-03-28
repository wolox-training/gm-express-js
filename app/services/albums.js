const request = require('request'),
  Album = require('../models').album,
  logger = require('../logger'),
  errors = require('../errors');

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/albums',
        json: true
      },
      (error, response, body) => {
        if (error) reject(error);
        resolve(body);
      }
    );
  });
};

exports.getOne = albumId => {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: `https://jsonplaceholder.typicode.com/albums/${albumId}`,
        json: true
      },
      (error, response, body) => {
        if (response.statusCode === 404) {
          reject(errors.badRequest('Album does not exist'));
        } else {
          if (error) reject(error);
          resolve(body);
        }
      }
    );
  });
};

exports.create = album => {
  return Album.create(album).catch(err => {
    logger.error(err);
    throw errors.savingError(err.errors.map(e => e.message));
  });
};

exports.getOneLocal = album => {
  return Album.findOne({
    where: album
  }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};
