const users = require('./users/users.service.js');
const shorturl = require('./shorturl/shorturl.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(shorturl);
};
