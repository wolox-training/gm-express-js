'use strict';

const bcrypt = require('bcryptjs'),
  validationResult = require('express-validator/check').validationResult,
  sessionManager = require('./../services/sessionManager'),
  userService = require('../services/users'),
  errors = require('../errors');

exports.create = (req, res, next) => {
  const saltRounds = 10;

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  bcrypt
    .hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;

      return userService.create(user).then(u => {
        res.status(200);
        res.send({ completeName: `${u.firstName} ${u.lastName}` });
        res.end();
      });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  userService.getByEmail(user.email).then(u => {
    if (u) {
      bcrypt.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode({ username: u.username });

          res.status(200);
          res.set(sessionManager.HEADER_NAME, auth);
          res.send({ token: auth });
        } else {
          next(errors.invalidUser);
        }
      });
    } else {
      next(errors.invalidUser);
    }
  });
};
