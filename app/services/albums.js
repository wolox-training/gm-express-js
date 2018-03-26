const request = require('request'),
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
