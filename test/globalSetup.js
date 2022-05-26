const app = require('../src/app');
const port = app.get('port');

module.exports = function () {
  app.listen(port);
};
