'use strict';

const bcrypt = require('bcryptjs'),
  validationResult = require('express-validator/check').validationResult,
  sessionManager = require('./../services/sessionManager'),
  userService = require('../services/users'),
  errors = require('../errors');

const createUser = user => {
  const saltRounds = 10;
  return bcrypt.hash(user.password, saltRounds).then(hash => {
    user.password = hash;

    return userService.create(user);
  });
};

exports.create = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  return createUser(user)
    .then(u => {
      res.status(200);
      res.send({ completeName: `${u.firstName} ${u.lastName}` });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

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
          const auth = sessionManager.encode({ email: u.email });

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

exports.getAll = (req, res, next) => {
  userService
    .getAll(req.query.page)
    .then(users => {
      res.status(200);
      res.send(users);
    })
    .catch(next);
};

exports.createAdmin = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.badRequest(validationErrors.mapped()));
  }

  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        role: 'admin'
      }
    : {};

  return userService
    .getByEmail(user.email)
    .then(u => {
      if (u) {
        return userService.update({ role: 'admin' }, u).then(admin => {
          res.status(200);
          res.send({ message: `${admin.firstName} ${admin.lastName} is admin` });
          res.end();
        });
      } else if (user.firstName && user.lastName && user.password) {
        return createUser(user).then(newUser => {
          res.status(200);
          res.send({ message: `${newUser.firstName} ${newUser.lastName} is admin and new user` });
          res.end();
        });
      } else {
        return next(errors.badRequest('Lack of at least one params: firstName, lastName or password'));
      }
    })
    .catch(next);
};
