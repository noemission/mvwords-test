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

describe("'short-url-redirect' middleware", () => {
  beforeAll((done) => {
    app.get('mongooseClient').connection.on('connected', () => done());
  });

  afterAll((done) => {
    app.get('mongooseClient').connection.close(() => done());
  });

  it('redirects to the correct url', async () => {
    const response = await axios.post(getUrl('/submit'), {
      url: 'http://example.com',
    });
    expect(response.data.shortCode).toBeTruthy();

    const redirect = await axios.get(getUrl(response.data.shortCode));
    expect(redirect.status).toBe(200);
    expect(redirect.request.res.responseUrl).toBe('http://example.com/');
  });
});
