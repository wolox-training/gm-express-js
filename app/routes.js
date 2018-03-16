const usersController = require('./controllers/users_controller'),
  validateUser = require('./middlewares/users_validations').validateUser;

exports.init = app => {
  app.post('/users', validateUser, usersController.create);
};
