const app = require('../../src/app');

describe("'shorturl' service", () => {
  beforeAll((done) => {
    app.get('mongooseClient').connection.on('connected', () => done());
  });

  afterAll((done) => {
    app.get('mongooseClient').connection.close(() => done());
  });

  it('registered the service', () => {
    const service = app.service('shorturl');
    expect(service).toBeTruthy();
  });

  it('requires a url property', async () => {
    const service = app.service('shorturl');
    expect.assertions(2);
    try {
      await service.create({});
    } catch (e) {
      expect(e).toHaveProperty('name', 'BadRequest');
      expect(e.message).toMatch('`url` is required');
    }
  });

  it('requires a valid url property', async () => {
    const service = app.service('shorturl');
    expect.assertions(2);
    try {
      await service.create({
        url: 'httpddd://test.test',
      });
    } catch (e) {
      expect(e).toHaveProperty('name', 'BadRequest');
      expect(e.message).toMatch('is not a valid URL');
    }
  });

  it('creates a random shortcode', async () => {
    const service = app.service('shorturl');
    const response = await service.create({
      url: 'http://test.test',
    });
    expect(response.shortCode).toBeTruthy();
    expect(response.shortCode).toHaveLength(6);
  });

  it('rejects a short user passed shortcode', async () => {
    const service = app.service('shorturl');
    expect.assertions(2);
    try {
      await service.create({
        url: 'http://test.test',
        shortCode: '1',
      });
    } catch (e) {
      expect(e).toHaveProperty('name', 'BadRequest');
      expect(e.message).toMatch('shorter than the minimum allowed length');
    }
  });

  it('rejects a user passed shortcode with bad characters', async () => {
    const service = app.service('shorturl');
    expect.assertions(2);
    try {
      await service.create({
        url: 'http://test.test',
        shortCode: 'adbs$',
      });
    } catch (e) {
      expect(e).toHaveProperty('name', 'BadRequest');
      expect(e.message).toMatch('`shortCode` is invalid');
    }
  });

  it('saves shortcodes in lowercase', async () => {
    const service = app.service('shorturl');
    await service.remove(null, { query: { shortCode: 'ABCD' } });
    const response = await service.create({
      url: 'http://test.test',
      shortCode: 'ABCD',
    });
    expect(response).toHaveProperty('shortCode', 'abcd');
  });

  it('rejects duplicate shortcodes', async () => {
    const service = app.service('shorturl');
    expect.assertions(2);
    await service.remove(null, { query: { shortCode: 'testing' } });
    await service.create({
      url: 'http://test.test',
      shortCode: 'testing',
    });
    try {
      await service.create({
        url: 'http://test.test',
        shortCode: 'testing',
      });
    } catch (e) {
      expect(e).toHaveProperty('name', 'Conflict');
      expect(e.message).toMatch('value already exists');
    }
  });
});
