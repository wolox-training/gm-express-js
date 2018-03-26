const request = require('request'),
  errors = require('../errors');

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    request.get('https://jsonplaceholder.typicode.com/albums', (error, response, body) => {
      if (error) reject(error);
      resolve(JSON.parse(body));
    });
  });
};
