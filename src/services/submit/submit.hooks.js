const { authenticate } = require('@feathersjs/authentication/lib/hooks');
module.exports = {
  before: {
    create: [
      async (ctx) => {
        try {
          await authenticate('jwt')(ctx);
        } catch (err) {
          // No-Op
        }
      },
    ],
  },
};
