const request = require('request'),
  logger = require('../logger'),
  errors = require('../errors');

exports.getPhotos = albumId => {
  return new Promise((resolve, reject) => {
    request(
      {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/photos',
        json: true,
        qs: {
          albumId
        }
      },
      (error, response, body) => {
        if (error) reject(error);
        resolve(body);
      }
    );
  });
};
