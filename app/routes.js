const usersController = require('./controllers/users_controller'),
  validateUser = require('./middlewares/users_validations').validateUser,
  validateEmail = require('./middlewares/users_validations').validateEmail;

exports.init = app => {
  app.post('/users', validateUser, usersController.create);
  app.post('/users/sessions', validateEmail, usersController.login);
};
