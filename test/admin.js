const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  User = require('./../app/models').user,
  sessionManager = require('./../app/services/sessionManager'),
  expect = chai.expect;

const successfulAdminLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'admin001@wolox.com.ar', password: '12345678' });
};

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

describe('admin', () => {
  describe('/admin/users POST', () => {
    it('expect to be successful and change user role to admin', done => {
      successfulAdminLogin().then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({ email: 'email1@wolox.com.ar' })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            return User.findOne({ where: { email: 'email1@wolox.com.ar' } }).then(u => {
              expect(u.role).to.equal('admin');
              dictum.chai(res);
            });
          })
          .then(() => done());
      });
    });

    it('expect to be successful and create an admin user', done => {
      successfulAdminLogin().then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({
            firstName: 'firstName2',
            lastName: 'lastName',
            password: 'password',
            email: 'email2@wolox.com.ar'
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            return User.findOne({ where: { email: 'email2@wolox.com.ar' } }).then(u => {
              expect(u.role).to.equal('admin');
              expect(u.firstName).to.equal('firstName2');
              dictum.chai(res);
            });
          })
          .then(() => done());
      });
    });

    it('expect to not create user if some parameters are lacking', done => {
      successfulAdminLogin().then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({ email: 'email3@wolox.com.ar', firstName: 'wegwe' })
          .catch(err => {
            expect(err).to.have.status(400);
          })
          .then(() => done());
      });
    });

    it('expect to unauthorize regular user', done => {
      successfulLogin().then(loginRes => {
        return chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .send({ email: 'email1@wolox.com.ar' })
          .catch(err => {
            expect(err).to.have.status(401);
          })
          .then(() => done());
      });
    });
  });
});
