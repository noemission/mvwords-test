const shortUrlRedirect = require('./short-url-redirect');
const shortUrlStats = require('./short-url-stats');

module.exports = function (app) {
  app.get('/:shortCode/stats', shortUrlStats(app));
  app.get('/:shortCode', shortUrlRedirect(app));
};
