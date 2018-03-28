const chai = require('chai'),
  nock = require('nock'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  expect = chai.expect;

const userEmail = 'email1@wolox.com.ar';
const otherEmail = 'admin001@wolox.com.ar';

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: userEmail, password: '12345678' });
};

const photoResponse = [
  {
    albumId: 1,
    id: 4451,
    title: 'officiis similique eligendi excepturi',
    url: 'http://placehold.it/600/a335a',
    thumbnailUrl: 'http://placehold.it/150/a335a'
  },
  {
    albumId: 1,
    id: 4452,
    title: 'qui quae delectus aut rem',
    url: 'http://placehold.it/600/947e46',
    thumbnailUrl: 'http://placehold.it/150/947e46'
  }
];

describe('photo', () => {
  describe('/users/albums/:id/photos', () => {
    it('expect to be successful', done => {
      const albumId = 1;

      nock('https://jsonplaceholder.typicode.com')
        .get('/photos')
        .query({ albumId })
        .reply(200, photoResponse);

      successfulLogin().then(loginRes => {
        return chai
          .request(server)
          .get(`/users/albums/${albumId}/photos`)
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.eql(2);
            dictum.chai(res);
          })
          .then(() => done());
      });
    });

    it('expect to fail because user do not bought the album', done => {
      const albumId = 2;

      successfulLogin().then(loginRes => {
        return chai
          .request(server)
          .get(`/users/albums/${albumId}/photos`)
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err.response).to.be.json;
            expect(err.response.body).to.have.property('error');
          })
          .then(() => done());
      });
    });

    it('expect to fail because album ID is not an integer', done => {
      const albumId = 'string';

      successfulLogin().then(loginRes => {
        return chai
          .request(server)
          .get(`/users/albums/${albumId}/photos`)
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .catch(err => {
            expect(err).to.have.status(400);
            expect(err.response).to.be.json;
            expect(err.response.body).to.have.property('error');
          })
          .then(() => done());
      });
    });
  });
});
