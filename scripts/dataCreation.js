const bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

exports.execute = () => {
  return bcrypt
    .hash('12345678', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'firstName1',
          lastName: 'lastName1',
          email: 'email1@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        User.create({
          firstName: 'admin',
          lastName: '001',
          email: 'admin001@wolox.com.ar',
          password: hash,
          role: 'admin'
        })
      );
      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
