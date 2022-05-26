const { get, pick } = require('lodash');

module.exports = (app) => {
  return async function shortUrlStats(req, res) {
    let user;
    try {
      const token = await app.service('authentication').parse(req, res, 'jwt');
      const authData = await app
        .service('authentication')
        .authenticate(token, {}, 'jwt');
      user = authData.user;
    } catch (error) {
      user = null;
    }
    const { data } = await app.service('shorturl').find({
      query: {
        shortCode: req.params.shortCode,
        $limit: 1,
      },
    });
    if (!data.length)
      return res
        .status(404)
        .send('This short code was not found on the system');

    const shortUrl = data[0];
    if (shortUrl.user && !shortUrl.user.equals(get(user, '_id')))
      return res
        .status(403)
        .send("You don't have permission to access this resource");

    return res.json(
      pick(shortUrl, [
        'hits',
        'url',
        'shortCode',
        'createdAt',
        'lastAccessedAt',
      ])
    );
  };
};
