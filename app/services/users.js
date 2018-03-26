const User = require('../models').user,
  logger = require('../logger'),
  errors = require('../errors');

exports.create = user => {
  return User.create(user).catch(err => {
    logger.error(err);
    throw errors.savingError(err.errors.map(e => e.message));
  });
};

exports.getOne = user => {
  return User.findOne({
    where: user
  }).catch(err => {
    throw errors.databaseError(err.detail);
  });
};

exports.getAll = (page = 1, limit = 20) => {
  return User.findAll({
    limit,
    order: [['id', 'ASC']],
    offset: limit * (page - 1),
    attributes: { exclude: ['password'] }
  }).catch(err => {
    logger.error(err);
    throw errors.databaseError(err.detail);
  });
};

exports.getByEmail = email => {
  return exports.getOne({ email });
};

exports.update = (props, user) => {
  return user.update(props).catch(err => {
    logger.error(err);
    throw errors.savingError(err.errors);
  });
};
