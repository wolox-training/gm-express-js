const usersController = require('./controllers/users_controller'),
  albumsController = require('./controllers/albums_controller'),
  auth = require('./middlewares/auth'),
  userValidation = require('./middlewares/users_validations');

exports.init = app => {
  app.post('/users', userValidation.validateUser, usersController.create);
  app.post('/users/sessions', userValidation.validateEmail, usersController.login);
  app.get('/users', auth.secure, usersController.getAll);
  app.post('/admin/users', auth.secureAdmin, userValidation.validateAdmin, usersController.createAdmin);
  app.get('/albums', auth.secure, albumsController.getAll);
};
