const { authenticate } = require('@feathersjs/authentication/lib/hooks');
const { disallow, required, keep } = require('feathers-hooks-common');

const { hashPassword, protect } =
  require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [authenticate('jwt')],
    create: [
      required('email', 'password'),
      keep('email', 'password'),
      hashPassword('password'),
    ],
    update: [disallow()],
    patch: [disallow('external'), hashPassword('password')],
    remove: [disallow('external')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
