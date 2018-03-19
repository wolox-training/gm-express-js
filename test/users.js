const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect;

describe('users', () => {
  describe('/users POST', () => {
    it('should be successful', done => {
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
          dictum.chai(res);
        })
        .then(() => done());
    });

    it('should fail because password is in invalid', done => {
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
