const { Submit } = require('./submit.class');
const hooks = require('./submit.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
  };
  app.use('/submit', new Submit(options, app));
  const service = app.service('submit');
  service.hooks(hooks);
};
