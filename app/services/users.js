const User = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors');

exports.create = user => {
  return User.create(user).catch(err => {
    logger.error(err);
    throw errors.savingError(err);
  });
};

exports.getOne = user => {
  return User.findOne({ where: user }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getAll = (props, limit = 20, offset = 0) => {
  return User.findAll({
    where: props,
    offset,
    limit
  }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getByEmail = email => {
  return exports.getOne({ email });
};

exports.update = (props, user) => {
  return User.update(props).catch(err => {
    throw errors.savingError(err.errors);
  });
};
