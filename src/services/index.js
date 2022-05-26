const users = require('./users/users.service.js');
const shorturl = require('./shorturl/shorturl.service.js');
const submit = require('./submit/submit.service.js');

module.exports = function (app) {
  app.configure(submit);
  app.configure(users);
  app.configure(shorturl);
};
