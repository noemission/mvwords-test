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

describe("'short-url-stats' middleware", () => {
  beforeAll((done) => {
    app.get('mongooseClient').connection.on('connected', () => done());
  });

  afterAll((done) => {
    app.get('mongooseClient').connection.close(() => done());
  });

  it('shows stats of a short url without a user', async () => {
    const response = await axios.post(getUrl('/submit'), {
      url: 'http://example.com',
    });
    expect(response.status).toBe(201);

    let stats = await axios.get(getUrl(`/${response.data.shortCode}/stats`));
    expect(stats.status).toBe(200);
    expect(stats.data.hits).toBe(0);

    await axios.get(getUrl(response.data.shortCode));

    stats = await axios.get(getUrl(`/${response.data.shortCode}/stats`));
    expect(stats.status).toBe(200);
    expect(stats.data.hits).toBe(1);
  });

  it('shows stats of a short url only to the owning user', async () => {
    const { accessToken } = await loginWithTestUser();
    const response = await axios({
      method: 'post',
      url: getUrl('/submit'),
      data: {
        url: 'http://example.com',
      },
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    expect(response.status).toBe(201);

    try {
      await axios.get(getUrl(`/${response.data.shortCode}/stats`));
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data).toMatch(
        "You don't have permission to access this resource"
      );
    }
    const stats = await axios({
      method: 'get',
      url: getUrl(`/${response.data.shortCode}/stats`),
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    expect(stats.status).toBe(200);
    expect(stats.data.hits).toBe(0);
  });
});
