const app = require('../../src/app');
const axios = require('axios');
const url = require('url');

const port = app.get('port') || 8998;
const getUrl = (pathname) =>
  url.format({
    hostname: app.get('host') || 'localhost',
    protocol: 'http',
    port,
    pathname,
  });

const loginWithTestUser = async () => {
  const userInfo = {
    email: 'someone@example.com',
    password: 'supersecret',
  };
  try {
    await app.service('users').create(userInfo);
  } catch (error) {
    // Do nothing, it just means the user already exists and can be tested
  }
  const { accessToken, user } = await app.service('authentication').create({
    strategy: 'local',
    ...userInfo,
  });
  return { accessToken, user };
};

describe("'submit' service", () => {
  beforeAll((done) => {
    app.get('mongooseClient').connection.on('connected', () => done());
  });

  afterAll((done) => {
    app.get('mongooseClient').connection.close(() => done());
  });

  it('registered the service', () => {
    const service = app.service('submit');
    expect(service).toBeTruthy();
  });

  it('creates a short url without a user', async () => {
    const response = await axios.post(getUrl('/submit'), {
      url: 'http://test.test',
    });
    expect(response.status).toBe(201);
    expect(response.data.user).toBeNull();
  });

  it('creates a short url with a user', async () => {
    const { accessToken, user } = await loginWithTestUser();
    const response = await axios({
      method: 'post',
      url: getUrl('/submit'),
      data: {
        url: 'http://test.test',
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    expect(response.status).toBe(201);
    expect(response.data.user).toBe(user._id.toString());
  });
});
