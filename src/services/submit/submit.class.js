const { Unprocessable } = require('@feathersjs/errors');
const { get, has } = require('lodash');

exports.Submit = class Submit {
  constructor(options, app) {
    this.app = app;
    this.options = options || {};
  }

  async create(data, params) {
    let triesCount = 0;
    let shouldRetry = false;
    do {
      try {
        triesCount++;
        return await this.app.service('shorturl').create({
          url: data.url,
          shortCode: data.shortCode,
          user: get(params, 'user._id', null),
        });
      } catch (error) {
        // In case the shorturl service was unable to generate a unique shortCode, retry the request up to 10 times
        shouldRetry =
          !data.shortCode &&
          error.code === 409 &&
          has(error, 'errors.shortCode');
        if (!shouldRetry) throw error;
      }
    } while (shouldRetry && triesCount < 10);
    return new Unprocessable("Couldn't generate a short code.");
  }
};
