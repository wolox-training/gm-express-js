const usersController = require('./controllers/users_controller'),
  albumsController = require('./controllers/albums_controller'),
  photosController = require('./controllers/photos_controller'),
  auth = require('./middlewares/auth'),
  userValidation = require('./middlewares/users_validations'),
  albumValidation = require('./middlewares/albums_validations');

exports.init = app => {
  // Users
  app.post('/users', userValidation.validateUser, usersController.create);
  app.post('/users/sessions', userValidation.validateEmail, usersController.login);
  app.get('/users', auth.secure, usersController.getAll);
  app.post('/admin/users', auth.secureAdmin, userValidation.validateAdmin, usersController.createAdmin);

  // Albums
  app.get('/albums', auth.secure, albumsController.getAll);
  app.post(
    '/users/:userId/albums',
    auth.sameAsLogged,
    albumValidation.validateAlbum,
    albumsController.create
  );

  // Photos
  app.get(
    '/users/albums/:id/photos',
    auth.secure,
    albumValidation.validateId,
    albumValidation.boughtByUser,
    photosController.getPhotosAlbum
  );
};
