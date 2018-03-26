const chai = require('chai'),
  nock = require('nock'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  expect = chai.expect;

const successfulLogin = cb => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({ email: 'email1@wolox.com.ar', password: '12345678' });
};

describe('album', () => {
  describe('/albums GET', () => {
    it('expect to be successful', done => {
      const albumResponse = [
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

      nock('https://jsonplaceholder.typicode.com')
        .get('/albums')
        .reply(200, albumResponse);

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
});
