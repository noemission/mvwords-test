module.exports = (app) => {
  return async function shortUrlRedirect(req, res) {
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
    await app.service('shorturl').patch(shortUrl._id, {
      $inc: { hits: 1 },
      lastAccessedAt: new Date(),
    });
    return res.redirect(shortUrl.url);
  };
};
