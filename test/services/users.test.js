const app = require('../../src/app');

describe("'users' service", () => {
  beforeAll((done) => {
    app.get('mongooseClient').connection.on('connected', () => done());
  });

  afterAll((done) => {
    app.get('mongooseClient').connection.close(() => done());
  });

  it('registered the service', () => {
    const service = app.service('users');
    expect(service).toBeTruthy();
  });

  it('creates new users', async () => {
    const service = app.service('users');
    // Remove user if the test has already run before
    await service.remove(null, {
      query: {
        email: 'test@test.com',
      },
    });

    const response = await service.create({
      email: 'test@test.com',
      password: 'secret',
    });
    expect(response).toBeTruthy();
    expect(response).toHaveProperty('email', 'test@test.com');
    expect(response.password === 'secret').toBeFalsy();
  });
});
