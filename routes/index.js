module.exports = function (app) {
  app.use('/api/tiles', require('./tile'));
};
