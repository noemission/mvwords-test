const { Shorturl } = require('./shorturl.class');
const createModel = require('../../models/shorturl.model');
const hooks = require('./shorturl.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true,
  };
  app.use('/shorturl', new Shorturl(options, app));
  const service = app.service('shorturl');
  service.hooks(hooks);
};
