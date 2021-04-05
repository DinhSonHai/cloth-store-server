const auth = require('./api/auth');

function route(app) {
  // Auth routes
  app.use('/api/auth', auth);
}

module.exports = route;