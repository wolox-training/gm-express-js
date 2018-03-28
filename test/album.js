const chai = require('chai'),
  nock = require('nock'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  User = require('../app/models').user,
  Album = require('../app/models').album,
  expect = chai.expect;

const userEmail = 'email1@wolox.com.ar';
const otherEmail = 'admin001@wolox.com.ar';

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: userEmail, password: '12345678' });
};

const albumsResponse = [
  {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim'
  },
  {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa'
  }
];

const albumResponse = externalId => {
  return {
    userId: 1,
    id: externalId,
    title: 'quidem molestiae enim'
  };
};

describe('album', () => {
  describe('/albums GET', () => {
    it('expect to be successful', done => {
      nock('https://jsonplaceholder.typicode.com')
        .get('/albums')
        .reply(200, albumsResponse);

      successfulLogin().then(loginRes => {
        return chai
          .request(server)
          .get('/albums')
          .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
          })
          .then(() => done());
      });
    });
  });

  describe('/users/:userId/albums POST', () => {
    it('expect to be sucessful', done => {
      const albumId = 2;

      nock('https://jsonplaceholder.typicode.com')
        .get(`/albums/${albumId}`)
        .reply(200, albumResponse(albumId));

      successfulLogin().then(loginRes => {
        return User.findOne({ where: { email: userEmail } }).then(user => {
          return chai
            .request(server)
            .post(`/users/${user.id}/albums`)
            .send({ externalId: albumId })
            .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
            .then(res => {
              expect(res).to.have.status(200);
              expect(res).to.be.json;
              expect(res.body).to.have.property('boughtAlbum');
              return Album.findOne({ where: { externalId: albumId, userId: user.id } }).then(a => {
                expect(a.title).to.equal(albumResponse(albumId).title);
                dictum.chai(res);
              });
            })
            .then(() => done());
        });
      });
    });

    it('expect to fail because user ever bought the album', done => {
      const albumId = 1;

      nock('https://jsonplaceholder.typicode.com')
        .get(`/albums/${albumId}`)
        .reply(200, albumResponse(albumId));

      successfulLogin().then(loginRes => {
        return User.findOne({ where: { email: userEmail } }).then(user => {
          return chai
            .request(server)
            .post(`/users/${user.id}/albums`)
            .send({ externalId: albumId })
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

    it('expect to fail because album do not exist', done => {
      const albumId = 1;

      nock('https://jsonplaceholder.typicode.com')
        .get(`/albums/${albumId}`)
        .reply(404, {});

      successfulLogin().then(loginRes => {
        return User.findOne({ where: { email: userEmail } }).then(user => {
          return chai
            .request(server)
            .post(`/users/${user.id}/albums`)
            .send({ externalId: albumId })
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

    it('expect to fail because extenal id is not an integer', done => {
      const albumId = 'string';

      successfulLogin().then(loginRes => {
        return User.findOne({ where: { email: userEmail } }).then(user => {
          return chai
            .request(server)
            .post(`/users/${user.id}/albums`)
            .send({ externalId: albumId })
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

    it('expect to fail because user logged is not same as URL', done => {
      const albumId = 1;

      successfulLogin().then(loginRes => {
        return User.findOne({ where: { email: otherEmail } }).then(user => {
          return chai
            .request(server)
            .post(`/users/${user.id}/albums`)
            .send({ externalId: albumId })
            .set(sessionManager.HEADER_NAME, loginRes.headers[sessionManager.HEADER_NAME])
            .catch(err => {
              expect(err).to.have.status(401);
              expect(err.response).to.be.json;
              expect(err.response.body).to.have.property('error');
            })
            .then(() => done());
        });
      });
    });
  });
});
