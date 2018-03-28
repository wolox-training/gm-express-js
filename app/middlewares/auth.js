const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);

    User.findOne({ where: user })
      .then(u => {
        if (u) {
          req.user = u;
          next();
        } else {
          next(errors.unauthorized);
        }
      })
      .catch(next);
  } else {
    next(errors.unauthorized);
  }
};

exports.secureAdmin = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);

    User.findOne({ where: user })
      .then(u => {
        if (u && u.role === 'admin') {
          req.user = u;
          next();
        } else {
          next(errors.unauthorized);
        }
      })
      .catch(next);
  } else {
    next(errors.unauthorized);
  }
};

exports.sameAsLogged = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);

    return User.findOne({ where: user })
      .then(u => {
        if (u.id === parseInt(req.params.userId)) {
          next();
        } else {
          next(errors.unauthorized);
        }
      })
      .catch(next);
  } else {
    next(errors.unauthorized);
  }
};
