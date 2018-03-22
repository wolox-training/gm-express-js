const chai = require('chai'),
  dictum = require('dictum.js'),
  expect = chai.expect,
  User = require('../app/models').user,
  server = require('./../app');

describe('users', () => {
  describe('/users/sessions POST', () => {
    it('expect to be successful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'email1@wolox.com.ar', password: '12345678' })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property('token');
          dictum.chai(res);
        })
        .then(() => done());
    });

    it('expect to return error for invalid email or/and password', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'invalid-email@wolox.com.ar', password: 'invalidPwd' })
        .then(res => {
          expect(res).to.not.have.status(200);
          done();
        })
        .catch(err => {
          expect(err).to.have.status(404);
          expect(err.response).to.be.json;
          expect(err.response.body).to.have.property('error');
          done();
        });
    });
  });

  describe('/users POST', () => {
    it('expect to be successful', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password',
          email: 'email@wolox.com.ar'
        })
        .then(res => {
          expect(res).to.have.status(200);
          return User.findOne({ where: { email: 'email@wolox.com.ar' } }).then(u => {
            expect(u.firstName).to.equal('firstName');
            expect(u.lastName).to.equal('lastName');
            dictum.chai(res);
          });
        })
        .then(() => done());
    });

    it('should fail because password is invalid', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'wegrd',
          email: 'email@wolox.com.ar'
        })
        .then(res => {
          expect(res).to.not.have.status(200);
          done();
        })
        .catch(err => {
          expect(err).to.have.status(400);
          done();
        });
    });

    ['firstName', 'lastName', 'password', 'email'].forEach(item => {
      const bodyRequest = {
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        email: 'email@wolox.com.ar'
      };
      delete bodyRequest[item];

      it(`should fail because ${item} is missing`, done => {
        chai
          .request(server)
          .post('/users')
          .send(bodyRequest)
          .catch(err => {
            expect(err).to.have.status(400);
          })
          .then(() => done());
      });
    });

    it('should fail because email exist', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password',
          email: 'email1@wolox.com.ar'
        })
        .catch(err => {
          expect(err).to.have.status(503);
        })
        .then(() => done());
    });
  });
});
