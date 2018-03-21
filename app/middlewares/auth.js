const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const user = sessionManager.decode(auth);

    User.findOne({ where: user }).then(u => {
      if (u) {
        req.user = u;
        next();
      } else {
        next(errors.unauthorized);
      }
    });
  } else {
    next(errors.unauthorized);
  }
};
